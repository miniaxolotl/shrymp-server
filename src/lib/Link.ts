import { nanoid } from 'nanoid';
import { Connection } from 'typeorm';

import { LinkModel } from "../model";

export interface Link {
	longURL?: string;
	tinyURL?: string;
	createdAt?: Date;
};

export const createTinyLink = ({
	long_url
}: {
	long_url: string
}) => {
	const newLink = new LinkModel();

	newLink.long_url = long_url;
	newLink.tiny_url = nanoid(8);

	return newLink;
};

export const saveTinyLink = async ({
	db,
	newLink
}: {
	db: Connection,
	newLink: LinkModel
}): Promise<boolean> => {
	return await new Promise((resolve, reject) => {
		db.transaction(async (transaction) => {
			await transaction.save(newLink);
			// FIXME this is to hide internal id
			newLink.id = undefined;
			resolve(true);
		}).catch((err) => {
			reject(false);
		});
	});
};

export const findTinyLink = async ({
	db,
	tiny_url
}: {
	db: Connection,
	tiny_url: string
}): Promise<LinkModel | null> => {
	const link_data: LinkModel[] = await db.query(`
		SELECT * FROM link
		WHERE tiny_url = ?`,
		[ tiny_url ]
	);

	if(link_data.length > 0) {
		// FIXME this is to hide internal id
		link_data[0].id = undefined;
		return link_data[0];
	} else {
		return null;
	}
};
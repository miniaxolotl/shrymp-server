import { Connection } from 'typeorm';

import { DomainModel } from '../model';

import domains from '../../config/domains.json';

export interface Domain {
	domain?: string;
	createdAt?: Date;
};

export const createDomain = ({
	domain
}: {
	domain: string;
}) => {
	const newDomain = new DomainModel();

	newDomain.domain = domain;

	return newDomain;
};

export const saveDomain = async ({
	db,
	newDomain
}: {
	db: Connection;
	newDomain: DomainModel;
}): Promise<boolean> => {
	return await new Promise((resolve, reject) => {
		db.transaction(async (transaction) => {
			await transaction.save(newDomain);
			resolve(true);
		}).catch(() => {
			reject(false);
		});
	});
};

export const findDomain = async ({
	db,
	domain_id
}: {
	db: Connection;
	domain_id: string;
}): Promise<DomainModel | null> => {
	const domain_data: DomainModel[] = await db.query(`
		SELECT * FROM domain
		WHERE id = ?`,
	[ domain_id ]
	);

	if(domain_data.length > 0) {
		return domain_data[0];
	} else {
		return null;
	}
};

export const findDomainByName = async ({
	db,
	domain
}: {
	db: Connection;
	domain: string;
}): Promise<DomainModel | null> => {
	const domain_data: DomainModel[] = await db.query(`
		SELECT * FROM domain
		WHERE domain = ?`,
	[ domain ]
	);

	if(domain_data.length > 0) {
		return domain_data[0];
	} else {
		return null;
	}
};

export const findDomainByLink = async ({
	db,
	link_id
}: {
	db: Connection;
	link_id: number;
}): Promise<DomainModel | null> => {
	const domain_data: DomainModel[] = await db.query(`
		SELECT domain.* FROM domain
		INNER JOIN link_domain
		ON domain.id = link_domain.domain_id
		WHERE link_id = ?`,
	[ link_id ]
	);

	if(domain_data.length > 0) {
		return domain_data[0];
	} else {
		return null;
	}
};

export const loadAllDomain = async ({
	db
}: {
	db: Connection;
}) => {
	return await new Promise((resolve, reject) => {
		db.transaction(async (transaction) => {
			for(const index in domains) {
				if(!await findDomainByName({ db, domain: domains[index] })) {
					const newDomain = createDomain({ domain: domains[index] });
					await saveDomain({
						db: transaction.connection,
						newDomain
					});
				}
			}
			resolve(true);
		}).catch(() => {
			reject(false);
		});
	});
};
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { DomainModel, LinkModel } from "./";

@Entity({ name: "link_domain" })
export class LinkDomainModel {
	@PrimaryGeneratedColumn()
	id!: number;

	/* relations */

    @OneToOne(() => DomainModel, domain => domain.id)
	@JoinColumn({ name: "domain_id" })
	domain!: DomainModel;

    @OneToOne(() => LinkModel, link => link.id)
	@JoinColumn({ name: "link_id" })
	link!: LinkModel;
};
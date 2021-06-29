import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LinkModel {
	@PrimaryGeneratedColumn()
	id!: number;
	
	@Column({ type: "text", nullable: false })
	long_url!: string;

	@Column({ type: "text", nullable: false })
	tiny_url!: string;

	@CreateDateColumn()
	create_date!: Date;
};
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'link' })
export class LinkModel {
	@PrimaryGeneratedColumn()
	id: number | undefined;
	
	@Column({ type: 'varchar', nullable: false })
	long_url: string | undefined;

	@Column({ type: 'varchar', nullable: false, unique: true })
	tiny_url: string | undefined;

	@CreateDateColumn()
	create_date: Date | undefined;
};
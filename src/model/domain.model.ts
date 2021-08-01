import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'domain' })
export class DomainModel {
	@PrimaryGeneratedColumn()
	id!: number;
	
	@Column({ type: 'varchar', nullable: false, unique: true  })
	domain: string | undefined;

	@CreateDateColumn()
	create_date: Date | undefined;
};
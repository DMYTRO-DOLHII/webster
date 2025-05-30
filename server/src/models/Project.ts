import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { User } from './User';

@Entity()
export class Project extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 255 })
	title: string;

	@Column({ nullable: true })
	previewImage: string;

	@Column({ type: 'json', nullable: true })
	info: Record<string, any>;

	@Column({ default: false })
	isTemplate: boolean;

    @Column({nullable: true})
    isPremium: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => User, user => user.projects, { nullable: false, onDelete: 'CASCADE' })
	user: User;
}

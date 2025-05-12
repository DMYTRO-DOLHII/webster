import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    BeforeInsert
} from 'typeorm';
import bcrypt from 'bcrypt'

export type SubscriptionType = 'free' | 'advanced' | 'pro';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ length: 255 })
    fullName: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ length: 255, unique: true })
    login: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    profilePicture: string;

    @Column({ default: true })
    isEmailConfirmed: boolean;

    @Column({
        type: 'enum',
        enum: ['free', 'advanced', 'pro'],
        default: 'free',
    })
    subscription: SubscriptionType;

    @BeforeInsert()
    async initUser() {
        this.password = await bcrypt.hash(this.password, 10);
        if (!this.profilePicture) {
            this.profilePicture = `https://avatars.githubusercontent.com/u/411583?s=80&v=4`;
        }
    }
}
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    BeforeInsert
} from 'typeorm';
import bcrypt from 'bcrypt'

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

    @Column({ default: false })
	isEmailConfirmed: boolean;


    @BeforeInsert()
    async initUser() {
        this.password = await bcrypt.hash(this.password, 10);
        if (!this.profilePicture) {
            this.profilePicture = `https://avatars.githubusercontent.com/u/411583?s=80&v=4`;
        }
    }
}
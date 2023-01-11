import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Role} from "./role/users.role.enum";
import {OrganizationEnum} from "../shared/warranty/organization.enum";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    organizationType: OrganizationEnum

    @Column()
    roles: Role;
}

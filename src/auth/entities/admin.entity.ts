import { nanoid } from "nanoid";
import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @BeforeInsert()
    generateId() {
        this.id = `adm_${nanoid()}`
    }
}
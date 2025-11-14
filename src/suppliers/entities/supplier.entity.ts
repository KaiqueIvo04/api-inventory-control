import { Optional } from "@nestjs/common";
import { nanoid } from "nanoid";
import { BeforeInsert, Column, Entity, IsNull, PrimaryColumn } from "typeorm";

@Entity()
export class Supplier {

    @PrimaryColumn()
    id: string

    @Column()
    name: string;
    
    @Column({ nullable: true })
    cnpj: string

    @Column({ nullable: true })
    phone: string

    @Column({ nullable: true })
    email: string

    @Column({ type: 'text', nullable: true })
    address: string

    @BeforeInsert()
    generateId() {
        this.id = `prod_${nanoid()}`
    }
}

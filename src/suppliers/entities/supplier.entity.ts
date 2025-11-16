import { nanoid } from "nanoid";
import { BeforeInsert, Column, CreateDateColumn, Entity, IsNull, PrimaryColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    generateId() {
        this.id = `supp_${nanoid()}`
    }
}

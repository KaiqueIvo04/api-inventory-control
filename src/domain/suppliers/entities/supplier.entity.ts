import { nanoid } from "nanoid";
import { BeforeInsert, Column, CreateDateColumn, Entity, IsNull, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Supplier {

    @PrimaryColumn()
    id: string

    @Column()
    name: string;

    @Column({ nullable: true, unique: true })
    cnpj: string

    @Column({ nullable: true })
    phone: string

    @Column({ nullable: true })
    email: string

    @Column({ type: 'text', nullable: true })
    address: string

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @BeforeInsert()
    generateId() {
        this.id = `supp_${nanoid()}`
    }
}

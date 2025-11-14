const { nanoid } = require("nanoid")
import { Supplier } from "src/suppliers/entities/supplier.entity";
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('Products')
export class Product {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text' })
    description: string;

    @Column()
    category: string;

    @ManyToOne(() => Supplier, { onDelete: 'SET NULL', nullable: true })
    supplier: Supplier;

    @Column()
    cost: number;

    @Column()
    price: number;

    @Column()
    inventory_quantity: number;

    @BeforeInsert()
    generateId() {
        this.id = `prod_${nanoid()}`
    }
}

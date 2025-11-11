const { nanoid } = require("nanoid")
import { Optional } from "@nestjs/common";
import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm";

@Entity('Products')
export class Product {

    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    category: string;

    @Column()
    supplier_id: string;

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

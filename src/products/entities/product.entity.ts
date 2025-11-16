import { nanoid } from "nanoid";
import { Supplier } from "src/suppliers/entities/supplier.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

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
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @Column({ nullable: true })
    supplier_id: string;

    @Column()
    cost: number;

    @Column()
    price: number;

    @Column()
    inventory_quantity: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    generateId() {
        this.id = `prod_${nanoid()}`
    }
}

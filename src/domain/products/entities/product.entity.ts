import { nanoid } from "nanoid";
import { Supplier } from "src/domain/suppliers/entities/supplier.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('Products')
export class Product {

    @PrimaryColumn()
    id: string;

    @Column({ type: 'text', nullable: true })
    image_base64: string;

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

    @Column({ 
        type: 'decimal', 
        precision: 10, 
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    cost: number;

    @Column({ 
        type: 'decimal', 
        precision: 10, 
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    price: number;

    @Column({ default: 0 })
    inventory_quantity: number;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @BeforeInsert()
    generateId() {
        this.id = `prod_${nanoid()}`
    }
}
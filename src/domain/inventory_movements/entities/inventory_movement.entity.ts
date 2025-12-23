import { nanoid } from "nanoid";
import { Product } from "src/domain/products/entities/product.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

export enum MovementType {
    BUY = 'buy',
    SELL = 'sell',
    ADJUST = 'adjust'
}

@Entity()
export class InventoryMovement {

    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Product, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    product_id: string;

    @Column({ enum: MovementType })
    type: MovementType;

    @Column()
    quantity: number;

    @Column({ type: 'date' })
    date_movement: Date;

    @Column({ type: 'text', nullable: true })
    observation: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    generateId() {
        this.id = `invmov_${nanoid()}`
    }
}


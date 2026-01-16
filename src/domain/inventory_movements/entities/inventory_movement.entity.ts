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

    @ManyToOne(() => Product, { onDelete: 'SET NULL', eager: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    product_id: string;

    @Column({ nullable: true })
    sale_id?: string;

    @Column({ type: 'enum', enum: MovementType })
    type: MovementType;

    @Column()
    quantity: number;

    @Column({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    date_movement: Date;

    @Column({ type: 'text', nullable: true })
    observation: string;

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
        this.id = `invmov_${nanoid()}`
    }
}


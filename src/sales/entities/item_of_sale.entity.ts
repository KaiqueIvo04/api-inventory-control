import { nanoid } from "nanoid";
import { Product } from "src/products/entities/product.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Sale } from "./sale.entity";

@Entity()
export class ItemOfSale {

    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Sale, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'sale_id' })
    sale: Sale;

    @Column()
    sale_id: string;

    @ManyToOne(() => Product, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column()
    product_id: string;
    
    // Armazena informações do produto no momento da venda
    // (caso o produto seja alterado depois)
    @Column({ nullable: true })
    product_name_snapshot?: string;

    @Column()
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unit_price: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    generateId() {
        this.id = `isal_${nanoid()}`
    }
}

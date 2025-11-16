import { nanoid } from "nanoid";
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { ItemOfSale } from "./item_of_sale.entity";

export enum PaymentMethod {
    MONEY = 'money',
    CARD = 'card',
    PIX = 'pix'
}

@Entity()
export class Sale {

    @PrimaryColumn()
    id: string;

    @OneToMany(() => ItemOfSale, (item) => item.sale, { cascade: true })
    items: ItemOfSale[]; // 👈 Adicione isso!

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    date_sale: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_value: number;

    @Column({ enum: PaymentMethod })
    payment_method: PaymentMethod;

    @Column({ nullable: true })
    name_client: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    generateId() {
        this.id = `sal_${nanoid()}`
    }
}

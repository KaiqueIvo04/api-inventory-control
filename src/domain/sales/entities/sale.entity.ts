import { nanoid } from "nanoid";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
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

    @OneToMany(() => ItemOfSale, (item) => item.sale)
    items: ItemOfSale[];

    @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
    date_sale: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_value: number;

    @Column({ enum: PaymentMethod })
    payment_method: PaymentMethod;

    @Column({ nullable: true })
    name_client: string;

    @Column()
    discount: number;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date;

    @BeforeInsert()
    generateId() {
        this.id = `sal_${nanoid()}`
    }
}

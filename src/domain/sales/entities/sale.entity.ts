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

    @OneToMany(() => ItemOfSale, (item) => item.sale, { eager: true })
    items: ItemOfSale[];

    @Column({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP'
    })
    date_sale: Date;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    total_value: number;

    @Column({ enum: PaymentMethod })
    payment_method: PaymentMethod;

    @Column()
    name_client: string;

    @Column({
        type: 'decimal', precision: 10, scale: 2, default: 0, transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value)
        }
    })
    discount: number;

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
        this.id = `sal_${nanoid()}`
    }
}

import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { OrderItemEntity } from './order-item.entity';
import { ShipmentEntity } from './shipment.entity';

@Entity('orders')
@Unique(['externalId'])
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 64 })
  externalId!: string;

  @Column()
  customerId!: number;

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders, { eager: true })
  customer!: Relation<CustomerEntity>;

  @Column({ type: 'datetime' })
  orderedAtUtc!: string;

  @Column({ length: 50 })
  status!: string;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.order)
  orderItems!: Relation<OrderItemEntity[]>;

  @OneToOne(() => ShipmentEntity, (shipment) => shipment.order)
  shipment!: Relation<ShipmentEntity> | null;
}
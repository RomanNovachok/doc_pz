import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('shipments')
@Unique(['externalId'])
@Unique(['orderId'])
export class ShipmentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 64 })
  externalId!: string;

  @Column()
  orderId!: number;

  @OneToOne(() => OrderEntity, (order) => order.shipment, { eager: true })
  @JoinColumn({ name: 'orderId' })
  order!: Relation<OrderEntity>;

  @Column({ length: 50 })
  status!: string;

  @Column({ length: 80 })
  trackingNumber!: string;

  @Column({ length: 120 })
  destinationCountry!: string;

  @Column({ length: 120 })
  destinationCity!: string;

  @Column({ length: 200 })
  destinationStreet!: string;
}
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';
import { ListingEntity } from './listing.entity';
import { OrderEntity } from './order.entity';

@Entity('order_items')
@Unique(['orderId', 'listingId'])
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  orderId!: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems, { eager: true })
  order!: Relation<OrderEntity>;

  @Column()
  listingId!: number;

  @ManyToOne(() => ListingEntity, (listing) => listing.orderItems, { eager: true })
  listing!: Relation<ListingEntity>;

  @Column()
  quantity!: number;

  @Column('float')
  unitPrice!: number;
}
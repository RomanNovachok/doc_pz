import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';
import { OrderItemEntity } from './order-item.entity';
import { ProductEntity } from './product.entity';
import { SellerEntity } from './seller.entity';

@Entity('listings')
@Unique(['sellerId', 'productId'])
export class ListingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  sellerId!: number;

  @Column()
  productId!: number;

  @ManyToOne(() => SellerEntity, (seller) => seller.listings, { eager: true })
  seller!: Relation<SellerEntity>;

  @ManyToOne(() => ProductEntity, (product) => product.listings, { eager: true })
  product!: Relation<ProductEntity>;

  @Column('float')
  price!: number;

  @Column({ length: 10 })
  currency!: string;

  @Column()
  stockQuantity!: number;

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.listing)
  orderItems!: Relation<OrderItemEntity[]>;
}
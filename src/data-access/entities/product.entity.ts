import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { ListingEntity } from './listing.entity';

@Entity('products')
@Unique(['asin'])
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 64 })
  asin!: string;

  @Column({ length: 250 })
  title!: string;

  @Column({ length: 20 })
  productType!: 'Physical' | 'Digital';

  @Column()
  categoryId!: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products, { eager: true })
  category!: Relation<CategoryEntity>;

  @OneToMany(() => ListingEntity, (listing) => listing.product)
  listings!: Relation<ListingEntity[]>;
}
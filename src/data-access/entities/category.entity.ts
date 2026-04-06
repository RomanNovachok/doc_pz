import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('categories')
@Unique(['name', 'parentCategoryId'])
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 200 })
  name!: string;

  @Column({ nullable: true })
  parentCategoryId!: number | null;

  @ManyToOne(() => CategoryEntity, (category) => category.children, { nullable: true })
  parentCategory!: Relation<CategoryEntity> | null;

  @OneToMany(() => CategoryEntity, (category) => category.parentCategory)
  children!: Relation<CategoryEntity[]>;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products!: Relation<ProductEntity[]>;
}
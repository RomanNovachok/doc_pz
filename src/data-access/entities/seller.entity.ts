import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';
import { ListingEntity } from './listing.entity';

@Entity('sellers')
@Unique(['externalId'])
export class SellerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 64 })
  externalId!: string;

  @Column({ length: 200 })
  name!: string;

  @Column({ length: 200 })
  email!: string;

  @OneToMany(() => ListingEntity, (listing) => listing.seller)
  listings!: Relation<ListingEntity[]>;
}
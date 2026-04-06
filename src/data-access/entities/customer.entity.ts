import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('customers')
@Unique(['externalId'])
export class CustomerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 64 })
  externalId!: string;

  @Column({ length: 200 })
  fullName!: string;

  @Column({ length: 200 })
  email!: string;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders!: Relation<OrderEntity[]>;
}
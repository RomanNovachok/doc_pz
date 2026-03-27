import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRepository } from '../../business/interfaces/customer-repository.interface';
import { CustomerModel } from '../../business/models/customer.model';
import { CustomerEntity } from '../entities/customer.entity';

@Injectable()
export class TypeOrmCustomerRepository implements CustomerRepository {
  constructor(@InjectRepository(CustomerEntity) private readonly customerRepository: Repository<CustomerEntity>) {}

  async upsertCustomer(input: Omit<CustomerModel, 'id'>): Promise<CustomerModel> {
    let customer = await this.customerRepository.findOne({ where: { externalId: input.externalId } });
    if (!customer) {
      customer = this.customerRepository.create(input);
    } else {
      customer.fullName = input.fullName;
      customer.email = input.email;
    }

    customer = await this.customerRepository.save(customer);
    return { id: customer.id, externalId: customer.externalId, fullName: customer.fullName, email: customer.email };
  }

  async findAllCustomers(): Promise<CustomerModel[]> {
    return (await this.customerRepository.find({ order: { id: 'ASC' } })).map((entity) => ({
      id: entity.id,
      externalId: entity.externalId,
      fullName: entity.fullName,
      email: entity.email,
    }));
  }

  countCustomers(): Promise<number> {
    return this.customerRepository.count();
  }
}

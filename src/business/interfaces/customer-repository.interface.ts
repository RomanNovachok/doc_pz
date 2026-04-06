import { CustomerModel } from '../models/customer.model';

export interface CustomerRepository {
  upsertCustomer(input: Omit<CustomerModel, 'id'>): Promise<CustomerModel>;
  findAllCustomers(): Promise<CustomerModel[]>;
  countCustomers(): Promise<number>;
}

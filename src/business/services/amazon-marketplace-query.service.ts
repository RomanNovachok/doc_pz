import { Inject, Injectable } from '@nestjs/common';
import { CatalogRepository } from '../interfaces/catalog-repository.interface';
import { CustomerRepository } from '../interfaces/customer-repository.interface';
import { OrderRepository } from '../interfaces/order-repository.interface';
import { CATALOG_REPOSITORY, CUSTOMER_REPOSITORY, ORDER_REPOSITORY } from '../interfaces/tokens';
import { ImportStatisticsModel } from '../models/import-statistics.model';

@Injectable()
export class AmazonMarketplaceQueryService {
  constructor(
    @Inject(CATALOG_REPOSITORY) private readonly catalogRepository: CatalogRepository,
    @Inject(CUSTOMER_REPOSITORY) private readonly customerRepository: CustomerRepository,
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async getStats(): Promise<ImportStatisticsModel> {
    const [categories, sellers, products, listings, customers, orders, orderItems, shipments] = await Promise.all([
      this.catalogRepository.countCategories(),
      this.catalogRepository.countSellers(),
      this.catalogRepository.countProducts(),
      this.catalogRepository.countListings(),
      this.customerRepository.countCustomers(),
      this.orderRepository.countOrders(),
      this.orderRepository.countOrderItems(),
      this.orderRepository.countShipments(),
    ]);

    return { categories, sellers, products, listings, customers, orders, orderItems, shipments };
  }

  getCategories() {
    return this.catalogRepository.findAllCategories();
  }

  getSellers() {
    return this.catalogRepository.findAllSellers();
  }

  getProducts() {
    return this.catalogRepository.findAllProducts();
  }

  getListings() {
    return this.catalogRepository.findAllListings();
  }

  getCustomers() {
    return this.customerRepository.findAllCustomers();
  }

  getOrders() {
    return this.orderRepository.findAllOrders();
  }

  getOrderItems() {
    return this.orderRepository.findAllOrderItems();
  }

  getShipments() {
    return this.orderRepository.findAllShipments();
  }
}

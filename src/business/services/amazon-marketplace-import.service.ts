import { Inject, Injectable } from '@nestjs/common';
import { CatalogRepository } from '../interfaces/catalog-repository.interface';
import { CustomerRepository } from '../interfaces/customer-repository.interface';
import { MarketplaceCsvReader } from '../interfaces/marketplace-csv-reader.interface';
import { OrderRepository } from '../interfaces/order-repository.interface';
import {
  CATALOG_REPOSITORY,
  CUSTOMER_REPOSITORY,
  MARKETPLACE_CSV_READER,
  ORDER_REPOSITORY,
} from '../interfaces/tokens';
import { ImportSummaryModel } from '../models/import-summary.model';
import { MarketplaceCsvRowModel } from '../models/marketplace-csv-row.model';

@Injectable()
export class AmazonMarketplaceImportService {
  constructor(
    @Inject(MARKETPLACE_CSV_READER) private readonly csvReader: MarketplaceCsvReader,
    @Inject(CATALOG_REPOSITORY) private readonly catalogRepository: CatalogRepository,
    @Inject(CUSTOMER_REPOSITORY) private readonly customerRepository: CustomerRepository,
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository,
  ) {}

  async importFromFile(csvPath: string): Promise<ImportSummaryModel> {
    const rows = await this.csvReader.read(csvPath);

    const categoryPathCache = new Set<string>();
    const sellers = new Set<string>();
    const products = new Set<string>();
    const listings = new Set<string>();
    const customers = new Set<string>();
    const orders = new Set<string>();
    const shipments = new Set<string>();
    let createdOrderItems = 0;

    for (const row of rows) {
      this.validateRow(row);

      const categorySegments = row.categoryPath
        .split('>')
        .map((segment) => segment.trim())
        .filter(Boolean);

      for (let index = 0; index < categorySegments.length; index += 1) {
        categoryPathCache.add(categorySegments.slice(0, index + 1).join('>'));
      }

      const category = await this.catalogRepository.upsertCategoryPath(categorySegments);
      const seller = await this.catalogRepository.upsertSeller({
        externalId: row.sellerExternalId,
        name: row.sellerName,
        email: row.sellerEmail,
      });
      sellers.add(seller.externalId);

      const product = await this.catalogRepository.upsertProduct({
        asin: row.productAsin,
        title: row.productTitle,
        productType: row.productType,
        categoryId: category.id,
      });
      products.add(product.asin);

      const listing = await this.catalogRepository.upsertListing({
        sellerId: seller.id,
        productId: product.id,
        price: row.price,
        currency: row.currency,
        stockQuantity: row.stockQuantity,
      });
      listings.add(`${seller.externalId}:${product.asin}`);

      const customer = await this.customerRepository.upsertCustomer({
        externalId: row.customerExternalId,
        fullName: row.customerFullName,
        email: row.customerEmail,
      });
      customers.add(customer.externalId);

      const order = await this.orderRepository.upsertOrder({
        externalId: row.orderExternalId,
        customerId: customer.id,
        orderedAtUtc: row.orderedAtUtc,
        status: row.orderStatus,
      });
      orders.add(order.externalId);

      const orderItemResult = await this.orderRepository.addOrderItemIfMissing({
        orderId: order.id,
        listingId: listing.id,
        quantity: row.quantity,
        unitPrice: row.price,
      });
      if (orderItemResult.created) {
        createdOrderItems += 1;
      }

      await this.orderRepository.upsertShipment({
        externalId: row.shipmentExternalId,
        orderId: order.id,
        status: row.shipmentStatus,
        trackingNumber: row.trackingNumber,
        destinationCountry: row.destinationCountry,
        destinationCity: row.destinationCity,
        destinationStreet: row.destinationStreet,
      });
      shipments.add(row.shipmentExternalId);
    }

    return {
      processedRows: rows.length,
      createdCategoryPaths: categoryPathCache.size,
      createdSellers: sellers.size,
      createdProducts: products.size,
      createdListings: listings.size,
      createdCustomers: customers.size,
      createdOrders: orders.size,
      createdOrderItems,
      upsertedShipments: shipments.size,
    };
  }

  private validateRow(row: MarketplaceCsvRowModel): void {
    if (!row.categoryPath.trim()) {
      throw new Error('Category path is required.');
    }

    if (row.price <= 0) {
      throw new Error(`Price must be positive for ASIN ${row.productAsin}.`);
    }

    if (row.quantity <= 0) {
      throw new Error(`Quantity must be positive for order ${row.orderExternalId}.`);
    }

    if (row.stockQuantity < 0) {
      throw new Error(`Stock quantity cannot be negative for listing ${row.sellerExternalId}/${row.productAsin}.`);
    }
  }
}

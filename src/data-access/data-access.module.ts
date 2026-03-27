import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CATALOG_REPOSITORY,
  CUSTOMER_REPOSITORY,
  MARKETPLACE_CSV_READER,
  ORDER_REPOSITORY,
  TEMPORARY_FILE_STORAGE,
} from '../business/interfaces/tokens';
import { AmazonMarketplaceCsvReader } from './csv/amazon-marketplace-csv.reader';
import { CategoryEntity } from './entities/category.entity';
import { CustomerEntity } from './entities/customer.entity';
import { ListingEntity } from './entities/listing.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderItemEntity } from './entities/order-item.entity';
import { ProductEntity } from './entities/product.entity';
import { SellerEntity } from './entities/seller.entity';
import { ShipmentEntity } from './entities/shipment.entity';
import { LocalTemporaryFileStorage } from './filesystem/local-temporary-file.storage';
import { TypeOrmCatalogRepository } from './repositories/typeorm-catalog.repository';
import { TypeOrmCustomerRepository } from './repositories/typeorm-customer.repository';
import { TypeOrmOrderRepository } from './repositories/typeorm-order.repository';

const databaseLocation = join(process.cwd(), 'data', 'amazon-marketplace.sqlite');
mkdirSync(join(process.cwd(), 'data'), { recursive: true });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: databaseLocation,
      autoSave: true,
      synchronize: true,
      entities: [
        CategoryEntity,
        SellerEntity,
        ProductEntity,
        ListingEntity,
        CustomerEntity,
        OrderEntity,
        OrderItemEntity,
        ShipmentEntity,
      ],
    }),
    TypeOrmModule.forFeature([
      CategoryEntity,
      SellerEntity,
      ProductEntity,
      ListingEntity,
      CustomerEntity,
      OrderEntity,
      OrderItemEntity,
      ShipmentEntity,
    ]),
  ],
  providers: [
    TypeOrmCatalogRepository,
    TypeOrmCustomerRepository,
    TypeOrmOrderRepository,
    AmazonMarketplaceCsvReader,
    LocalTemporaryFileStorage,
    { provide: CATALOG_REPOSITORY, useExisting: TypeOrmCatalogRepository },
    { provide: CUSTOMER_REPOSITORY, useExisting: TypeOrmCustomerRepository },
    { provide: ORDER_REPOSITORY, useExisting: TypeOrmOrderRepository },
    { provide: MARKETPLACE_CSV_READER, useExisting: AmazonMarketplaceCsvReader },
    { provide: TEMPORARY_FILE_STORAGE, useExisting: LocalTemporaryFileStorage },
  ],
  exports: [CATALOG_REPOSITORY, CUSTOMER_REPOSITORY, ORDER_REPOSITORY, MARKETPLACE_CSV_READER, TEMPORARY_FILE_STORAGE],
})
export class DataAccessModule {}

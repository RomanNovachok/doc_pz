import { Module } from '@nestjs/common';
import { DataAccessModule } from '../data-access/data-access.module';
import { AmazonMarketplaceImportService } from './services/amazon-marketplace-import.service';
import { AmazonMarketplaceQueryService } from './services/amazon-marketplace-query.service';
import { ProductMvcService } from './services/product-mvc.service';

@Module({
  imports: [DataAccessModule],
  providers: [AmazonMarketplaceImportService, AmazonMarketplaceQueryService, ProductMvcService],
  exports: [AmazonMarketplaceImportService, AmazonMarketplaceQueryService, ProductMvcService, DataAccessModule],
})
export class BusinessModule {}
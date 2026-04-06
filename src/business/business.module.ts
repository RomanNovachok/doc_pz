import { Module } from '@nestjs/common';
import { DataAccessModule } from '../data-access/data-access.module';
import { AmazonMarketplaceImportService } from './services/amazon-marketplace-import.service';
import { AmazonMarketplaceQueryService } from './services/amazon-marketplace-query.service';

@Module({
  imports: [DataAccessModule],
  providers: [AmazonMarketplaceImportService, AmazonMarketplaceQueryService],
  exports: [AmazonMarketplaceImportService, AmazonMarketplaceQueryService, DataAccessModule],
})
export class BusinessModule {}

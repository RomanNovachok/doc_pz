import { Module } from '@nestjs/common';
import { BusinessModule } from './business/business.module';
import { DataAccessModule } from './data-access/data-access.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [DataAccessModule, BusinessModule, PresentationModule],
})
export class AppModule {}

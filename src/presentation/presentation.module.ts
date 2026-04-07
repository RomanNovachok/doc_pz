import { Module } from '@nestjs/common';
import { BusinessModule } from '../business/business.module';
import { DataController } from './controllers/data.controller';
import { HomeController } from './controllers/home.controller';
import { ImportsController } from './controllers/imports.controller';
import { ProductsController } from './controllers/products.controller';

@Module({
  imports: [BusinessModule],
  controllers: [HomeController, ImportsController, DataController, ProductsController],
})
export class PresentationModule {}
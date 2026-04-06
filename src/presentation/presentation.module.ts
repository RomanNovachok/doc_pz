import { Module } from '@nestjs/common';
import { BusinessModule } from '../business/business.module';
import { DataController } from './controllers/data.controller';
import { ImportsController } from './controllers/imports.controller';

@Module({
  imports: [BusinessModule],
  controllers: [ImportsController, DataController],
})
export class PresentationModule {}

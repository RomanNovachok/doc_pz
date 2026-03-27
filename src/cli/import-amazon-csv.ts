import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AmazonMarketplaceImportService } from '../business/services/amazon-marketplace-import.service';

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const csvPath = getArg('--csv') ?? 'data/amazon_marketplace_seed.csv';
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });

  try {
    const importService = app.get(AmazonMarketplaceImportService);
    const summary = await importService.importFromFile(csvPath);
    console.log('Import completed successfully.');
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await app.close();
  }
}

void main();

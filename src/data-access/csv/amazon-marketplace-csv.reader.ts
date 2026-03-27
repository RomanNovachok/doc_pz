import { promises as fs } from 'node:fs';
import { Injectable } from '@nestjs/common';
import { MarketplaceCsvReader } from '../../business/interfaces/marketplace-csv-reader.interface';
import { MarketplaceCsvRowModel } from '../../business/models/marketplace-csv-row.model';

@Injectable()
export class AmazonMarketplaceCsvReader implements MarketplaceCsvReader {
  private readonly expectedColumns = 23;

  async read(filePath: string): Promise<MarketplaceCsvRowModel[]> {
    const rawContent = await fs.readFile(filePath, 'utf8');
    const lines = rawContent.split(/\r?\n/).filter((line) => line.trim().length > 0);

    if (lines.length <= 1) {
      return [];
    }

    return lines.slice(1).map((line, index) => this.mapRow(this.parseCsvLine(line), index + 2));
  }

  private mapRow(columns: string[], lineNumber: number): MarketplaceCsvRowModel {
    if (columns.length !== this.expectedColumns) {
      throw new Error(`Line ${lineNumber} has ${columns.length} columns instead of ${this.expectedColumns}.`);
    }

    return {
      sellerExternalId: columns[0].trim(),
      sellerName: columns[1].trim(),
      sellerEmail: columns[2].trim(),
      categoryPath: columns[3].trim(),
      productAsin: columns[4].trim(),
      productTitle: columns[5].trim(),
      productType: columns[6].trim() === 'Digital' ? 'Digital' : 'Physical',
      price: Number(columns[7]),
      currency: columns[8].trim(),
      stockQuantity: Number(columns[9]),
      customerExternalId: columns[10].trim(),
      customerFullName: columns[11].trim(),
      customerEmail: columns[12].trim(),
      orderExternalId: columns[13].trim(),
      orderedAtUtc: new Date(columns[14]).toISOString(),
      orderStatus: columns[15].trim(),
      quantity: Number(columns[16]),
      shipmentExternalId: columns[17].trim(),
      shipmentStatus: columns[18].trim(),
      trackingNumber: columns[19].trim(),
      destinationCountry: columns[20].trim(),
      destinationCity: columns[21].trim(),
      destinationStreet: columns[22].trim(),
    };
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];

      if (char === '"') {
        if (inQuotes && line[index + 1] === '"') {
          current += '"';
          index += 1;
          continue;
        }

        inQuotes = !inQuotes;
        continue;
      }

      if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
        continue;
      }

      current += char;
    }

    result.push(current);
    return result;
  }
}

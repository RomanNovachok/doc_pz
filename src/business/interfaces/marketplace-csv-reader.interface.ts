import { MarketplaceCsvRowModel } from '../models/marketplace-csv-row.model';

export interface MarketplaceCsvReader {
  read(filePath: string): Promise<MarketplaceCsvRowModel[]>;
}

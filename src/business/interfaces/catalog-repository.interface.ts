import { CategoryModel } from '../models/category.model';
import { ListingModel } from '../models/listing.model';
import { ProductModel } from '../models/product.model';
import { SellerModel } from '../models/seller.model';

export interface CatalogRepository {
  upsertCategoryPath(pathSegments: string[]): Promise<CategoryModel>;
  upsertSeller(input: Omit<SellerModel, 'id'>): Promise<SellerModel>;
  upsertProduct(input: Omit<ProductModel, 'id'>): Promise<ProductModel>;
  upsertListing(input: Omit<ListingModel, 'id'>): Promise<ListingModel>;
  createProduct(input: Omit<ProductModel, 'id'>): Promise<ProductModel>;
  updateProduct(id: number, input: Omit<ProductModel, 'id'>): Promise<ProductModel>;
  deleteProduct(id: number): Promise<void>;
  findProductById(id: number): Promise<ProductModel | null>;
  findAllCategories(): Promise<CategoryModel[]>;
  findAllSellers(): Promise<SellerModel[]>;
  findAllProducts(): Promise<ProductModel[]>;
  findAllListings(): Promise<ListingModel[]>;
  countCategories(): Promise<number>;
  countSellers(): Promise<number>;
  countProducts(): Promise<number>;
  countListings(): Promise<number>;
}

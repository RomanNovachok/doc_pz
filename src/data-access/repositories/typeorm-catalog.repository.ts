import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CatalogRepository } from '../../business/interfaces/catalog-repository.interface';
import { CategoryModel } from '../../business/models/category.model';
import { ListingModel } from '../../business/models/listing.model';
import { ProductModel } from '../../business/models/product.model';
import { SellerModel } from '../../business/models/seller.model';
import { CategoryEntity } from '../entities/category.entity';
import { ListingEntity } from '../entities/listing.entity';
import { ProductEntity } from '../entities/product.entity';
import { SellerEntity } from '../entities/seller.entity';

@Injectable()
export class TypeOrmCatalogRepository implements CatalogRepository {
  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(SellerEntity) private readonly sellerRepository: Repository<SellerEntity>,
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ListingEntity) private readonly listingRepository: Repository<ListingEntity>,
  ) {}

  async upsertCategoryPath(pathSegments: string[]): Promise<CategoryModel> {
    let parentCategory: CategoryEntity | null = null;

    for (const segment of pathSegments) {
      let category: CategoryEntity | null;

      if (parentCategory) {
        category = await this.categoryRepository.findOne({
          where: { name: segment, parentCategoryId: parentCategory.id },
        });
      } else {
        category = await this.categoryRepository.findOne({
          where: { name: segment, parentCategoryId: IsNull() },
        });
      }

      if (!category) {
        category = this.categoryRepository.create({
          name: segment,
          parentCategoryId: parentCategory ? parentCategory.id : null,
          parentCategory,
        });
        category = await this.categoryRepository.save(category);
      }

      parentCategory = category;
    }

    if (!parentCategory) {
      throw new Error('Category path must contain at least one segment.');
    }

    return this.toCategoryModel(parentCategory);
  }

  async upsertSeller(input: Omit<SellerModel, 'id'>): Promise<SellerModel> {
    let seller = await this.sellerRepository.findOne({ where: { externalId: input.externalId } });
    if (!seller) {
      seller = this.sellerRepository.create(input);
    } else {
      seller.name = input.name;
      seller.email = input.email;
    }

    return this.toSellerModel(await this.sellerRepository.save(seller));
  }

  async upsertProduct(input: Omit<ProductModel, 'id'>): Promise<ProductModel> {
    let product = await this.productRepository.findOne({ where: { asin: input.asin } });
    if (!product) {
      product = this.productRepository.create(input);
    } else {
      product.title = input.title;
      product.productType = input.productType;
      product.categoryId = input.categoryId;
    }

    return this.toProductModel(await this.productRepository.save(product));
  }

  async upsertListing(input: Omit<ListingModel, 'id'>): Promise<ListingModel> {
    let listing = await this.listingRepository.findOne({
      where: { sellerId: input.sellerId, productId: input.productId },
    });

    if (!listing) {
      listing = this.listingRepository.create(input);
    } else {
      listing.price = input.price;
      listing.currency = input.currency;
      listing.stockQuantity = input.stockQuantity;
    }

    return this.toListingModel(await this.listingRepository.save(listing));
  }

  async findAllCategories(): Promise<CategoryModel[]> {
    return (await this.categoryRepository.find({ order: { id: 'ASC' } })).map((item) => this.toCategoryModel(item));
  }

  async findAllSellers(): Promise<SellerModel[]> {
    return (await this.sellerRepository.find({ order: { id: 'ASC' } })).map((item) => this.toSellerModel(item));
  }

  async findAllProducts(): Promise<ProductModel[]> {
    return (await this.productRepository.find({ order: { id: 'ASC' } })).map((item) => this.toProductModel(item));
  }

  async findAllListings(): Promise<ListingModel[]> {
    return (await this.listingRepository.find({ order: { id: 'ASC' } })).map((item) => this.toListingModel(item));
  }

  countCategories(): Promise<number> {
    return this.categoryRepository.count();
  }

  countSellers(): Promise<number> {
    return this.sellerRepository.count();
  }

  countProducts(): Promise<number> {
    return this.productRepository.count();
  }

  countListings(): Promise<number> {
    return this.listingRepository.count();
  }

  private toCategoryModel(entity: CategoryEntity): CategoryModel {
    return { id: entity.id, name: entity.name, parentCategoryId: entity.parentCategoryId ?? null };
  }

  private toSellerModel(entity: SellerEntity): SellerModel {
    return { id: entity.id, externalId: entity.externalId, name: entity.name, email: entity.email };
  }

  private toProductModel(entity: ProductEntity): ProductModel {
    return {
      id: entity.id,
      asin: entity.asin,
      title: entity.title,
      productType: entity.productType,
      categoryId: entity.categoryId,
    };
  }

  private toListingModel(entity: ListingEntity): ListingModel {
    return {
      id: entity.id,
      sellerId: entity.sellerId,
      productId: entity.productId,
      price: entity.price,
      currency: entity.currency,
      stockQuantity: entity.stockQuantity,
    };
  }
}
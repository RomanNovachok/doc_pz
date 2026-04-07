import { Inject, Injectable } from '@nestjs/common';
import { CatalogRepository } from '../interfaces/catalog-repository.interface';
import { CATALOG_REPOSITORY } from '../interfaces/tokens';
import { CategoryModel } from '../models/category.model';
import { ProductFormModel } from '../models/product-form.model';
import { ProductFormPageModel, ProductListItemModel } from '../models/product-page.model';

@Injectable()
export class ProductMvcService {
  constructor(@Inject(CATALOG_REPOSITORY) private readonly catalogRepository: CatalogRepository) {}

  async getProductsPage(): Promise<{ pageTitle: string; products: ProductListItemModel[] }> {
    const [products, categories] = await Promise.all([
      this.catalogRepository.findAllProducts(),
      this.catalogRepository.findAllCategories(),
    ]);

    return {
      pageTitle: 'Amazon Products',
      products: products.map((product) => ({
        ...product,
        categoryPath: this.buildCategoryPath(product.categoryId, categories),
      })),
    };
  }

  async getCreatePage(errorMessage?: string, product?: Partial<ProductFormModel>): Promise<ProductFormPageModel> {
    return this.buildFormPage('Create Product', '/products/create', 'Create Product', errorMessage, product);
  }

  async getEditPage(id: number, errorMessage?: string, fallback?: Partial<ProductFormModel>): Promise<ProductFormPageModel> {
    const product = await this.catalogRepository.findProductById(id);
    if (!product && !fallback) {
      throw new Error(`Product with id ${id} was not found.`);
    }

    return this.buildFormPage('Edit Product', `/products/${id}/edit`, 'Save Changes', errorMessage, fallback ?? product ?? undefined);
  }

  async createProduct(input: ProductFormModel): Promise<void> {
    this.validateForm(input);
    await this.catalogRepository.createProduct(input);
  }

  async updateProduct(id: number, input: ProductFormModel): Promise<void> {
    this.validateForm(input);
    await this.catalogRepository.updateProduct(id, input);
  }

  deleteProduct(id: number): Promise<void> {
    return this.catalogRepository.deleteProduct(id);
  }

  private async buildFormPage(
    title: string,
    action: string,
    submitLabel: string,
    errorMessage?: string,
    product?: Partial<ProductFormModel>,
  ): Promise<ProductFormPageModel> {
    const categories = await this.catalogRepository.findAllCategories();
    const productType = product?.productType ?? 'Physical';
    const categoryId = product?.categoryId ?? null;

    return {
      title,
      action,
      submitLabel,
      product: {
        asin: product?.asin ?? '',
        title: product?.title ?? '',
        productType,
        categoryId,
        isPhysical: productType === 'Physical',
        isDigital: productType === 'Digital',
      },
      categories: categories
        .map((category) => ({
          id: category.id,
          label: this.buildCategoryPath(category.id, categories),
          selected: category.id === categoryId,
        }))
        .sort((left, right) => left.label.localeCompare(right.label)),
      errorMessage,
    };
  }

  private validateForm(input: ProductFormModel): void {
    if (!input.asin.trim()) {
      throw new Error('ASIN is required.');
    }

    if (!input.title.trim()) {
      throw new Error('Title is required.');
    }

    if (!['Physical', 'Digital'].includes(input.productType)) {
      throw new Error('Product type must be Physical or Digital.');
    }

    if (!Number.isInteger(input.categoryId) || input.categoryId <= 0) {
      throw new Error('Category must be selected.');
    }
  }

  private buildCategoryPath(categoryId: number, categories: CategoryModel[]): string {
    const byId = new Map(categories.map((category) => [category.id, category]));
    const path: string[] = [];
    let current = byId.get(categoryId) ?? null;

    while (current) {
      path.unshift(current.name);
      current = current.parentCategoryId ? byId.get(current.parentCategoryId) ?? null : null;
    }

    return path.join(' > ');
  }
}
export interface ProductFormModel {
  asin: string;
  title: string;
  productType: 'Physical' | 'Digital';
  categoryId: number;
}

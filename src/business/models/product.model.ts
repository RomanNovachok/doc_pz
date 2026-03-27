export interface ProductModel {
  id: number;
  asin: string;
  title: string;
  productType: 'Physical' | 'Digital';
  categoryId: number;
}

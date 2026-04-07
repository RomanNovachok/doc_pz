export interface ProductListItemModel {
  id: number;
  asin: string;
  title: string;
  productType: 'Physical' | 'Digital';
  categoryId: number;
  categoryPath: string;
}

export interface ProductCategoryOptionModel {
  id: number;
  label: string;
  selected: boolean;
}

export interface ProductFormPageModel {
  title: string;
  action: string;
  submitLabel: string;
  product: {
    asin: string;
    title: string;
    productType: 'Physical' | 'Digital';
    categoryId: number | null;
    isPhysical: boolean;
    isDigital: boolean;
  };
  categories: ProductCategoryOptionModel[];
  errorMessage?: string;
}
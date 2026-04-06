export interface CategoryModel {
  id: number;
  name: string;
  parentCategoryId: number | null;
}

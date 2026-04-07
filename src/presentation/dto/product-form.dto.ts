import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ProductFormDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  asin!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value ?? '').trim())
  title!: string;

  @IsString()
  @IsIn(['Physical', 'Digital'])
  productType!: 'Physical' | 'Digital';

  @Transform(({ value }) => Number(value))
  @IsInt()
  categoryId!: number;
}
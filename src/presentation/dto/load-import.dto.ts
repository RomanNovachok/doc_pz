import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoadImportDto {
  @ApiProperty({ example: 'data/amazon_marketplace_seed.csv' })
  @IsString()
  @IsNotEmpty()
  csvPath!: string;
}

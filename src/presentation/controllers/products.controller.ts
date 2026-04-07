import { Body, Controller, Get, Param, ParseIntPipe, Post, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { ProductMvcService } from '../../business/services/product-mvc.service';
import { ProductFormDto } from '../dto/product-form.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productMvcService: ProductMvcService) {}

  @Get()
  @Render('products/index')
  products() {
    return this.productMvcService.getProductsPage();
  }

  @Get('create')
  @Render('products/form')
  createPage() {
    return this.productMvcService.getCreatePage();
  }

  @Post('create')
  async create(@Body() body: ProductFormDto, @Res() response: Response) {
    try {
      await this.productMvcService.createProduct(body);
      return response.redirect('/products');
    } catch (error) {
      return response.status(400).render(
        'products/form',
        await this.productMvcService.getCreatePage(error instanceof Error ? error.message : 'Unable to create product.', body),
      );
    }
  }

  @Get(':id/edit')
  @Render('products/form')
  editPage(@Param('id', ParseIntPipe) id: number) {
    return this.productMvcService.getEditPage(id);
  }

  @Post(':id/edit')
  async edit(@Param('id', ParseIntPipe) id: number, @Body() body: ProductFormDto, @Res() response: Response) {
    try {
      await this.productMvcService.updateProduct(id, body);
      return response.redirect('/products');
    } catch (error) {
      return response.status(400).render(
        'products/form',
        await this.productMvcService.getEditPage(id, error instanceof Error ? error.message : 'Unable to update product.', body),
      );
    }
  }

  @Post(':id/delete')
  async delete(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    try {
      await this.productMvcService.deleteProduct(id);
      return response.redirect('/products');
    } catch {
      return response.redirect('/products');
    }
  }
}
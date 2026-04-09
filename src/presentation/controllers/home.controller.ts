import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class HomeController {
  @Get()
  index(@Res() response: Response) {
    return response.redirect('/products');
  }
}
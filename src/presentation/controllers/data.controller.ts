import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AmazonMarketplaceQueryService } from '../../business/services/amazon-marketplace-query.service';

@ApiTags('data')
@Controller('data')
export class DataController {
  constructor(private readonly queryService: AmazonMarketplaceQueryService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  categories() {
    return this.queryService.getCategories();
  }

  @Get('sellers')
  @ApiOperation({ summary: 'Get all sellers' })
  sellers() {
    return this.queryService.getSellers();
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  products() {
    return this.queryService.getProducts();
  }

  @Get('listings')
  @ApiOperation({ summary: 'Get all listings' })
  listings() {
    return this.queryService.getListings();
  }

  @Get('customers')
  @ApiOperation({ summary: 'Get all customers' })
  customers() {
    return this.queryService.getCustomers();
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders' })
  orders() {
    return this.queryService.getOrders();
  }

  @Get('order-items')
  @ApiOperation({ summary: 'Get all order items' })
  orderItems() {
    return this.queryService.getOrderItems();
  }

  @Get('shipments')
  @ApiOperation({ summary: 'Get all shipments' })
  shipments() {
    return this.queryService.getShipments();
  }
}

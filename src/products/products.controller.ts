import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FindProductsDto } from './dto/find-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiQuery({ name: 'filter', required: false, enum: ['drink', 'food'] })
  @ApiQuery({
    name: 'page',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    example: 20,
  })
  @Get()
  findAll(@Query() query: FindProductsDto) {
    return this.productsService.findAll(
      query.filter ?? '',
      query.page ?? 1,
      query.limit ?? 10,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}

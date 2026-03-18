import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin Products')
@ApiBearerAuth()
@UseGuards(JwtAdminAuthGuard)
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  findAll(
    @Query('categoryName') categoryName?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.findAll(
      categoryName,
      page ? +page : 1,
      limit ? +limit : 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.productsService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

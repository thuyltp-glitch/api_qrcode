import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin Categories')
@ApiBearerAuth()
@UseGuards(JwtAdminAuthGuard)
@Controller('admin/categories')
export class AdminCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo danh mục mới' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách danh mục' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết danh mục' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.categoryService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa danh mục' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}

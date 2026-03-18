import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin Tables')
@ApiBearerAuth()
@UseGuards(JwtAdminAuthGuard)
@Controller('admin/tables')
export class AdminTablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bàn mới' })
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả bàn' })
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết bàn' })
  findOne(@Param('id') id: string) {
    return this.tablesService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật bàn' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.tablesService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bàn' })
  remove(@Param('id') id: string) {
    return this.tablesService.remove(id);
  }
}

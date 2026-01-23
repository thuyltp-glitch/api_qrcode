import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TablesService } from './tables.service';
import { SessionsService } from '../sessions/sessions.service';
import { CartsService } from '../carts/carts.service';
import { CreateTableDto } from './dto/create-table.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tables')
@Controller('tables')
export class TablesController {
  constructor(
    private readonly tablesService: TablesService,
    private readonly sessionsService: SessionsService,
    private readonly cartsService: CartsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Tạo bàn mới' })
  create(@Body() createTableDto: CreateTableDto) {
    return this.tablesService.create(createTableDto);
  }

  @Get('qr/:tableCode/session')
  @ApiOperation({ summary: 'Lấy hoặc tạo session và cart từ QR code' })
  @ApiParam({ name: 'tableCode', description: 'Mã bàn từ QR code' })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin bàn, session và cart (tạo mới nếu chưa có)',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bàn' })
  async getOrCreateSession(@Param('tableCode') tableCode: string) {
    const table = await this.tablesService.findByCode(tableCode);

    let session = await this.sessionsService.findActiveSession(table._id);
    if (!session) {
      session = await this.sessionsService.createSession(table._id);
    }

    let cart = await this.cartsService.findActiveCart(session._id);
    if (!cart) {
      cart = await this.cartsService.createCart(session._id);
    }

    return {
      table: {
        _id: table._id,
        table_number: table.table_number,
        table_code: table.table_code,
        status: table.status,
        capacity: table.capacity,
      },
      session: {
        _id: session._id,
        table_id: session.table_id,
        status: session.status,
        started_at: session.started_at,
        ended_at: session.ended_at,
      },
      cart: {
        _id: cart._id,
        session_id: cart.session_id,
        status: cart.status,
        createdAt: cart['createdAt'],
      },
    };
  }
}

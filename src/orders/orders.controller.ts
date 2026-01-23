import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateOrderItemStatusDto } from './dto/update-order-item-status.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới từ giỏ hàng' })
  @ApiBody({ type: CreateOrderDto })
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrderFromCart(createOrderDto.cart_id);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả đơn hàng' })
  async findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin đơn hàng theo ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Get(':id/items')
  @ApiOperation({ summary: 'Lấy đơn hàng kèm danh sách sản phẩm' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  async findOrderWithItems(@Param('id') id: string) {
    return this.ordersService.findOrderWithItems(id);
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Lấy tất cả đơn hàng theo Session ID' })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  async findOrdersBySession(@Param('sessionId') sessionId: string) {
    return this.ordersService.findOrdersBySession(sessionId);
  }

  @Get('session/:sessionId/items')
  @ApiOperation({
    summary: 'Lấy tất cả order items theo Session (cho trang đơn hàng)',
  })
  @ApiParam({ name: 'sessionId', description: 'Session ID' })
  async getAllOrderItemsBySession(@Param('sessionId') sessionId: string) {
    return this.ordersService.getAllOrderItemsBySession(sessionId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ type: UpdateOrderStatusDto })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(
      id,
      updateOrderStatusDto.status,
    );
  }

  @Patch('items/:itemId/status')
  @ApiOperation({
    summary: 'Cập nhật trạng thái từng món (cho nhà bếp/quầy bar)',
  })
  @ApiParam({ name: 'itemId', description: 'Order Item ID' })
  @ApiBody({ type: UpdateOrderItemStatusDto })
  async updateOrderItemStatus(
    @Param('itemId') itemId: string,
    @Body() updateOrderItemStatusDto: UpdateOrderItemStatusDto,
  ) {
    return this.ordersService.updateOrderItemStatus(
      itemId,
      updateOrderItemStatusDto.status,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  async cancelOrder(@Param('id') id: string) {
    return this.ordersService.cancelOrder(id);
  }
}

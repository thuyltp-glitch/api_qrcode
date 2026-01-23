import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { AddItemToCartDto } from './dto/add-item-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post(':cartId/items')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  @ApiParam({ name: 'cartId', description: 'ID của giỏ hàng' })
  @ApiResponse({ status: 201, description: 'Thêm sản phẩm thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy giỏ hàng' })
  addItemToCart(
    @Param('cartId') cartId: string,
    @Body() addItemDto: AddItemToCartDto,
  ) {
    return this.cartsService.addItemToCart(
      cartId,
      addItemDto.product_id,
      addItemDto.quantity,
    );
  }

  @Get(':cartId/items')
  @ApiOperation({ summary: 'Lấy giỏ hàng với danh sách sản phẩm' })
  @ApiParam({ name: 'cartId', description: 'ID của giỏ hàng' })
  @ApiResponse({
    status: 200,
    description: 'Trả về giỏ hàng và danh sách items',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy giỏ hàng' })
  getCartWithItems(@Param('cartId') cartId: string) {
    return this.cartsService.getCartWithItems(cartId);
  }

  @Patch(':cartId/items/:itemId')
  @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm' })
  @ApiParam({ name: 'cartId', description: 'ID của giỏ hàng' })
  @ApiParam({ name: 'itemId', description: 'ID của cart item' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  updateItemQuantity(
    @Param('itemId') itemId: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    return this.cartsService.updateItemQuantity(itemId, updateDto.quantity);
  }

  @Delete(':cartId/items/:itemId')
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi giỏ hàng' })
  @ApiParam({ name: 'cartId', description: 'ID của giỏ hàng' })
  @ApiParam({ name: 'itemId', description: 'ID của cart item' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  removeItemFromCart(@Param('itemId') itemId: string) {
    return this.cartsService.removeItemFromCart(itemId);
  }
}

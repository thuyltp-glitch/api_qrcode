import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';
import { CartItem } from './schemas/cart-item.schema';
import { CART_STATUS } from '../common/enums/enum';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItem>,
  ) {}

  async findActiveCart(sessionId: string | Types.ObjectId) {
    const cart = await this.cartModel
      .findOne({
        session_id: sessionId,
        status: CART_STATUS.ACTIVE,
      })
      .sort({ createdAt: -1 })
      .exec();

    return cart;
  }

  async createCart(sessionId: string | Types.ObjectId) {
    const newCart = await this.cartModel.create({
      session_id: sessionId,
      status: CART_STATUS.ACTIVE,
    });

    return newCart;
  }

  async submitCart(cartId: string) {
    return this.cartModel.findByIdAndUpdate(
      cartId,
      { status: CART_STATUS.SUBMITTED },
      { new: true },
    );
  }

  async closeCart(cartId: string) {
    return this.cartModel.findByIdAndUpdate(
      cartId,
      { status: CART_STATUS.CLOSED },
      { new: true },
    );
  }

  async findById(cartId: string) {
    return this.cartModel.findById(cartId);
  }

  async addItemToCart(cartId: string, productId: string, quantity: number) {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    if (cart.status !== CART_STATUS.ACTIVE) {
      throw new BadRequestException('Giỏ hàng không ở trạng thái active');
    }

    const existingItem = await this.cartItemModel.findOne({
      cart_id: cartId,
      product_id: productId,
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      return existingItem.save();
    }

    return this.cartItemModel.create({
      cart_id: cartId,
      product_id: productId,
      quantity,
    });
  }

  async getCartWithItems(cartId: string) {
    const cart = await this.cartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    const items = await this.cartItemModel
      .find({ cart_id: cartId })
      .populate('product_id')
      .exec();

    return {
      cart,
      items,
    };
  }

  async updateItemQuantity(itemId: string, quantity: number) {
    const item = await this.cartItemModel.findById(itemId);
    if (!item) {
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
    }

    item.quantity = quantity;
    return item.save();
  }

  async removeItemFromCart(itemId: string) {
    const result = await this.cartItemModel.findByIdAndDelete(itemId);
    if (!result) {
      throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
    }
    return result;
  }
}

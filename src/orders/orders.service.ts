import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { OrderItem } from './schemas/order-item.schema';
import { Cart } from '../carts/schemas/cart.schema';
import { CartItem } from '../carts/schemas/cart-item.schema';
import { Product } from '../products/schemas/product.schema';
import { ORDER_STATUS, ORDER_ITEM_STATUS } from '../common/enums/enum';
import { CART_STATUS } from '../common/enums/enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<Order>,
    @InjectModel(OrderItem.name)
    private readonly orderItemModel: Model<OrderItem>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
    @InjectModel(CartItem.name)
    private readonly cartItemModel: Model<CartItem>,
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async createOrderFromCart(cartId: string) {
    // Tìm cart
    const cart = await this.cartModel.findById(cartId);
    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng');
    }

    // Kiểm tra trạng thái cart
    if (cart.status !== CART_STATUS.ACTIVE) {
      throw new BadRequestException('Giỏ hàng không ở trạng thái active');
    }

    // Lấy tất cả cart items
    const cartItems = await this.cartItemModel
      .find({ cart_id: cartId })
      .populate('product_id')
      .exec();

    if (!cartItems || cartItems.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    // Tính tổng giá của cart items mới
    let newItemsPrice = 0;
    for (const item of cartItems) {
      const product = item.product_id as any;
      if (!product) {
        throw new NotFoundException(
          `Không tìm thấy sản phẩm với ID: ${item.product_id}`,
        );
      }
      newItemsPrice += product.price * item.quantity;
    }

    // Kiểm tra xem session đã có order chưa (order chưa PAID hoặc CANCEL)
    const existingOrder = await this.orderModel
      .findOne({
        session_id: cart.session_id,
        status: { $nin: [ORDER_STATUS.PAID, ORDER_STATUS.CANCEL] },
      })
      .exec();

    let order;
    const orderItems: any[] = [];

    if (existingOrder) {
      // Đã có order → thêm items vào order hiện tại
      order = existingOrder;

      // Cập nhật tổng giá
      order.total_price += newItemsPrice;
      await order.save();

      // Thêm order items mới
      for (const cartItem of cartItems) {
        const product = cartItem.product_id as any;

        // Kiểm tra xem có item nào cùng product và đều SERVED không
        const existingServedItem = await this.orderItemModel.findOne({
          order_id: order._id,
          product_id: cartItem.product_id,
          status: ORDER_ITEM_STATUS.SERVED,
        });

        if (existingServedItem) {
          // Gộp vào item đã SERVED
          existingServedItem.quantity += cartItem.quantity;
          await existingServedItem.save();
          orderItems.push(existingServedItem);
        } else {
          // Tạo order item mới
          const orderItem = await this.orderItemModel.create({
            order_id: order._id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            price: product.price,
            status: ORDER_ITEM_STATUS.PENDING,
          });
          orderItems.push(orderItem);
        }
      }
    } else {
      // Chưa có order → tạo order mới
      order = await this.orderModel.create({
        session_id: cart.session_id,
        total_price: newItemsPrice,
        status: ORDER_STATUS.NEW,
      });

      // Tạo order items từ cart items
      for (const cartItem of cartItems) {
        const product = cartItem.product_id as any;
        const orderItem = await this.orderItemModel.create({
          order_id: order._id,
          product_id: cartItem.product_id,
          quantity: cartItem.quantity,
          price: product.price,
          status: ORDER_ITEM_STATUS.PENDING,
        });
        orderItems.push(orderItem);
      }
    }

    // Xóa cart items sau khi tạo/cập nhật order
    await this.cartItemModel.deleteMany({ cart_id: cartId });

    return {
      order,
      items: orderItems,
      isNewOrder: !existingOrder,
    };
  }
  //  ----------------------------------------------------------------------
  async findAll() {
    return this.orderModel.find().populate('session_id').exec();
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id).populate('session_id');
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return order;
  }

  async findOrderWithItems(orderId: string) {
    const order = await this.orderModel
      .findById(orderId)
      .populate('session_id');
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    const items = await this.orderItemModel
      .find({ order_id: orderId })
      .populate('product_id')
      .exec();

    return {
      order,
      items,
    };
  }

  async findOrdersBySession(sessionId: string) {
    const orders = await this.orderModel
      .find({ session_id: new Types.ObjectId(sessionId) })
      .populate('session_id')
      .exec();

    // Lấy items cho mỗi order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await this.orderItemModel
          .find({ order_id: order._id })
          .populate('product_id')
          .exec();

        return {
          ...order.toObject(),
          items,
        };
      }),
    );

    return ordersWithItems;
  }

  async updateOrderStatus(orderId: string, status: ORDER_STATUS) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    order.status = status;
    return order.save();
  }

  async cancelOrder(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    if (
      order.status === ORDER_STATUS.DONE ||
      order.status === ORDER_STATUS.PAID
    ) {
      throw new BadRequestException(
        'Không thể hủy đơn hàng đã hoàn thành hoặc đã thanh toán',
      );
    }

    order.status = ORDER_STATUS.CANCEL;
    return order.save();
  }

  // Order Item Status Management
  async updateOrderItemStatus(itemId: string, status: ORDER_ITEM_STATUS) {
    const item = await this.orderItemModel.findById(itemId);
    if (!item) {
      throw new NotFoundException('Không tìm thấy order item');
    }

    item.status = status;
    return item.save();
  }

  async getAllOrderItemsBySession(sessionId: string) {
    // Lấy tất cả orders của session
    const orders = await this.orderModel
      .find({ session_id: new Types.ObjectId(sessionId) })
      .exec();

    if (!orders || orders.length === 0) {
      return [];
    }

    const orderIds = orders.map((order) => order._id);

    // Lấy tất cả order items của các orders này
    const items = await this.orderItemModel
      .find({ order_id: { $in: orderIds } })
      .populate('product_id')
      .populate({
        path: 'order_id',
        populate: { path: 'session_id' },
      })
      .exec();

    return items;
  }
}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ORDER_ITEM_STATUS } from '../../common/enums/enum';

export type OrderItemDocument = HydratedDocument<OrderItem>;

@Schema({ timestamps: true, versionKey: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product_id: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({
    required: true,
    enum: ORDER_ITEM_STATUS,
    default: ORDER_ITEM_STATUS.PENDING,
  })
  status: ORDER_ITEM_STATUS;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ORDER_STATUS } from '../../common/enums/enum';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true, versionKey: false })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'Session', required: true })
  session_id: Types.ObjectId;

  @Prop({ required: true, type: Number })
  total_price: number;

  @Prop({ required: true, enum: ORDER_STATUS, default: ORDER_STATUS.NEW })
  status: ORDER_STATUS;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

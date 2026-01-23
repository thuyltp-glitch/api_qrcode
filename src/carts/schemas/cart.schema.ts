import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CART_STATUS } from '../../common/enums/enum';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true, versionKey: false })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'Session', required: true })
  session_id: Types.ObjectId;

  @Prop({ required: true, enum: CART_STATUS, default: CART_STATUS.ACTIVE })
  status: CART_STATUS;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

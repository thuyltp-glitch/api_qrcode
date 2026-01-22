import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, versionKey: false })
export class Product {
  @Prop({ required: true, unique: true })
  product_name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  image_url: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' })
  category_id: Types.ObjectId;

  @Prop({ default: true, required: true })
  status: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

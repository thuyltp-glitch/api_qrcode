import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, versionKey: false })
export class Category {
  @Prop({ required: true, unique: true })
  category_name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

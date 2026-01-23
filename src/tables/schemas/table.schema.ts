import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TABLE_STATUS } from '../../common/enums/enum';

// Định nghĩa kiểu document để sử dụng trong service/controller
export type TableDocument = HydratedDocument<Table>;

// @Schema decorator đánh dấu class này là một schema của MongoDB
// timestamps: true sẽ tự động thêm createdAt và updatedAt
@Schema({ timestamps: true, versionKey: false })
export class Table {
  // @Prop decorator định nghĩa property trong document
  // required: true bắt buộc phải có
  // unique: true đảm bảo không trùng lặp (ví dụ số bàn)
  @Prop({ required: true, unique: true })
  table_number: string;

  @Prop({ required: true, unique: true })
  table_code: string;

  // Có thể định nghĩa enum, và giá trị mặc định
  @Prop({ required: true, enum: TABLE_STATUS, default: TABLE_STATUS.AVAILABLE })
  status: TABLE_STATUS;

  // Property không bắt buộc (không có required: true)
  @Prop()
  capacity: number;
}

// Tạo schema từ class
export const TableSchema = SchemaFactory.createForClass(Table);

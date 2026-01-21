import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TableStatus } from '../../common/enums/enum';

// Định nghĩa kiểu document để sử dụng trong service/controller
export type TableDocument = HydratedDocument<Table>;

// @Schema decorator đánh dấu class này là một schema của MongoDB
// timestamps: true sẽ tự động thêm createdAt và updatedAt
@Schema({ timestamps: true })
export class Table {
  // @Prop decorator định nghĩa property trong document
  // required: true bắt buộc phải có
  // unique: true đảm bảo không trùng lặp (ví dụ số bàn)
  @Prop({ required: true, unique: true })
  table_number: string;

  // Có thể định nghĩa enum, và giá trị mặc định
  @Prop({ required: true, enum: TableStatus, default: TableStatus.AVAILABLE })
  status: TableStatus;

  // Property không bắt buộc (không có required: true)
  @Prop()
  capacity: number;

  @Prop()
  qr_code_url: string;

  @Prop()
  token: string;
}

// Tạo schema từ class
export const TableSchema = SchemaFactory.createForClass(Table);

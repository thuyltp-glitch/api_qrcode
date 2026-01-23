import {
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemToCartDto {
  @ApiProperty({
    description: 'ID của sản phẩm',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'ID sản phẩm không được để trống' })
  @IsMongoId({ message: 'ID sản phẩm không hợp lệ' })
  product_id: string;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 2,
    default: 1,
  })
  @IsNumber({}, { message: 'Số lượng phải là số' })
  @IsPositive({ message: 'Số lượng phải là số dương' })
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  quantity: number = 1;
}

import { IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Cart ID không được để trống' })
  @IsMongoId({ message: 'Cart ID không hợp lệ' })
  cart_id: string;
}

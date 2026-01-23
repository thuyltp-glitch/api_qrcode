import { IsEnum, IsNotEmpty } from 'class-validator';
import { ORDER_STATUS } from '../../common/enums/enum';

export class UpdateOrderStatusDto {
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsEnum(ORDER_STATUS, { message: 'Trạng thái không hợp lệ' })
  status: ORDER_STATUS;
}

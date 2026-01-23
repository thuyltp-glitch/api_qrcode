import { IsEnum, IsNotEmpty } from 'class-validator';
import { ORDER_ITEM_STATUS } from '../../common/enums/enum';

export class UpdateOrderItemStatusDto {
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsEnum(ORDER_ITEM_STATUS, { message: 'Trạng thái không hợp lệ' })
  status: ORDER_ITEM_STATUS;
}

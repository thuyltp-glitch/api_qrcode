import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { TableStatus } from '../../common/enums/enum';

export class CreateTableDto {
  @IsNotEmpty()
  @IsString()
  table_number: string;

  @IsNotEmpty()
  @IsEnum(TableStatus)
  status: TableStatus;
}

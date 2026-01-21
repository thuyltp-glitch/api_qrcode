import { PartialType } from '@nestjs/mapped-types';
import { CreateTableDto } from './create-table.dto';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TableStatus } from '../../common/enums/enum';

export class UpdateTableDto extends PartialType(CreateTableDto) {
  @IsNotEmpty()
  @IsEnum(TableStatus)
  status: TableStatus;
}

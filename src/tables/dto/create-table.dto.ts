import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TABLE_STATUS } from '../../common/enums/enum';

export class CreateTableDto {
  @ApiProperty({
    description: 'Số bàn (duy nhất)',
    example: '1',
  })
  @IsNotEmpty({ message: 'Số bàn không được để trống' })
  @IsString({ message: 'Số bàn phải là chuỗi' })
  table_number: string;

  @ApiProperty({
    description: 'Mã bàn duy nhất (từ QR code)',
    example: 'TABLE_001',
  })
  @IsNotEmpty({ message: 'Mã bàn không được để trống' })
  @IsString({ message: 'Mã bàn phải là chuỗi' })
  table_code: string;

  @ApiPropertyOptional({
    description: 'Trạng thái bàn',
    enum: TABLE_STATUS,
    default: TABLE_STATUS.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(TABLE_STATUS, { message: 'Trạng thái không hợp lệ' })
  status?: TABLE_STATUS;

  @ApiPropertyOptional({
    description: 'Sức chứa (số lượng chỗ ngồi)',
    example: 4,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Sức chứa phải là số' })
  @IsPositive({ message: 'Sức chứa phải là số dương' })
  capacity?: number;
}

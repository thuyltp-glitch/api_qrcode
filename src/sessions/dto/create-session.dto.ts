import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiProperty({
    description: 'ID của bàn',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'ID bàn không được để trống' })
  @IsMongoId({ message: 'ID bàn không hợp lệ' })
  table_id: string;
}

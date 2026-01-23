import { IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCartDto {
  @ApiProperty({
    description: 'ID của session',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty({ message: 'ID session không được để trống' })
  @IsMongoId({ message: 'ID session không hợp lệ' })
  session_id: string;
}

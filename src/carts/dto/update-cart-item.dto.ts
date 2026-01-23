import { IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Số lượng mới',
    example: 3,
  })
  @IsNumber({}, { message: 'Số lượng phải là số' })
  @IsPositive({ message: 'Số lượng phải là số dương' })
  @Min(1, { message: 'Số lượng tối thiểu là 1' })
  quantity: number;
}

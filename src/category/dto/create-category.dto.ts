import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Food, Drink' })
  @IsNotEmpty()
  @IsString()
  category_name: string;
}

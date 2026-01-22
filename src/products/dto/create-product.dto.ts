import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name' })
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsNotEmpty()
  @IsString()
  image_url: string;

  @ApiProperty({ example: 'category_id' })
  @IsNotEmpty()
  @IsMongoId()
  category_id: string;

  @ApiProperty({ example: true })
  @IsOptional()
  status?: boolean;
}

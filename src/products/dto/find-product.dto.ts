import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindProductsDto {
  @ApiPropertyOptional({
    enum: ['drink', 'food'],
    description: 'Category filter',
  })
  filter?: string;

  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  limit?: number;
}

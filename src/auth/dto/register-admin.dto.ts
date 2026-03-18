import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAdminDto {
  @ApiProperty({ example: 'admin123', description: 'Tên đăng nhập admin' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  @IsString()
  @MinLength(6)
  password: string;
}

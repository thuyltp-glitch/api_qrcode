import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
  ) {}

  async registerAdmin(registerAdminDto: RegisterAdminDto) {
    const { username, password } = registerAdminDto;
    const existing = await this.adminModel.findOne({ username });
    if (existing) {
      throw new UnauthorizedException('Username already exists');
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = new this.adminModel({
      username,
      passwordHash,
      role: 'admin',
    });
    await admin.save();
    return { message: 'Admin created successfully' };
  }

  async loginAdmin(loginAdminDto: LoginAdminDto) {
    const { username, password } = loginAdminDto;
    const admin = await this.adminModel.findOne({ username });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: admin.username,
      sub: admin._id,
      role: admin.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

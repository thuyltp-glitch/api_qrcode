import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Table } from './schemas/table.schema';
import { TABLE_STATUS } from '../common/enums/enum';
import { Model } from 'mongoose';

@Injectable()
export class TablesService {
  constructor(
    @InjectModel(Table.name)
    private readonly tableModel: Model<Table>,
  ) {}

  create(createTableDto: CreateTableDto) {
    return this.tableModel.create(createTableDto);
  }

  async findByCode(tableCode: string) {
    const table = await this.tableModel.findOne({ table_code: tableCode });

    if (!table) {
      throw new NotFoundException(`Không tìm thấy bàn với mã: ${tableCode}`);
    }

    if (table.status === TABLE_STATUS.UNAVAILABLE) {
      throw new BadRequestException('Bàn này đang có người ngồi');
    }

    return table;
  }

  async findById(tableId: string) {
    return this.tableModel.findById(tableId);
  }

  async findAll() {
    return this.tableModel.find().exec();
  }
}

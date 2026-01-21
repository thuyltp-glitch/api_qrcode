import { Injectable } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Table } from './schemas/table.schema';
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
}

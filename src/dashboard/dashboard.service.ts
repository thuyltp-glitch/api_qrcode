import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../orders/schemas/order.schema';
import { Session } from '../sessions/schemas/session.schema';
import { Table } from '../tables/schemas/table.schema';
import { ORDER_STATUS, SESSION_STATUS } from '../common/enums/enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
    @InjectModel(Table.name) private tableModel: Model<Table>,
  ) {}

  async getStats() {
    // Tổng số đơn hàng
    const totalOrders = await this.orderModel.countDocuments();
    
    // Tổng doanh thu (các đơn hàng PAID/DONE)
    const orders = await this.orderModel.find({
      status: { $in: [ORDER_STATUS.PAID, ORDER_STATUS.DONE] }
    }).exec();
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total_price || 0), 0);
    
    // Phiên đang hoạt động
    const activeSessions = await this.sessionModel.countDocuments({
      status: SESSION_STATUS.OPEN
    });

    // Tổng số bàn
    const totalTables = await this.tableModel.countDocuments();

    return {
      totalOrders,
      totalRevenue,
      activeSessions,
      totalTables,
    };
  }
}

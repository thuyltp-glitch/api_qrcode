import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session } from './schemas/session.schema';
import { SESSION_STATUS } from '../common/enums/enum';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<Session>,
  ) {}

  async findActiveSession(tableId: string | Types.ObjectId) {
    const session = await this.sessionModel
      .findOne({
        table_id: tableId,
        status: SESSION_STATUS.OPEN,
      })
      .sort({ started_at: -1 })
      .exec();

    return session;
  }

  async createSession(tableId: string | Types.ObjectId) {
    const newSession = await this.sessionModel.create({
      table_id: tableId,
      status: SESSION_STATUS.OPEN,
      started_at: new Date(),
    });

    return newSession;
  }

  async closeSession(sessionId: string) {
    return this.sessionModel.findByIdAndUpdate(
      sessionId,
      {
        status: SESSION_STATUS.CLOSED,
        ended_at: new Date(),
      },
      { new: true },
    );
  }
}

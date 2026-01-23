import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SESSION_STATUS } from '../../common/enums/enum';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ timestamps: true, versionKey: false })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'Table', required: true })
  table_id: Types.ObjectId;

  @Prop({ required: true, enum: SESSION_STATUS, default: SESSION_STATUS.OPEN })
  status: SESSION_STATUS;

  @Prop({ required: true, default: () => new Date() })
  started_at: Date;

  @Prop({ default: null })
  ended_at: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  dueDate: Date;

  @Prop({ default: false })
  completed: boolean;

  @Prop({
    type: String,
    enum: TaskStatus,
    default: TaskStatus.PENDING,
    required: false,
  })
  status: TaskStatus;

  @Prop({ required: true })
  userId: string;
}

export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);

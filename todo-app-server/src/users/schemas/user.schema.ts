import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '' })
  profileImage: string;

  @Prop({ default: '' })
  linkedinUrl: string;
  @Prop({ default: '' })
  linkedInName: string;

  @Prop({ default: '' })
  linkedInProfileUrl: string; 

  @Prop({ default: '' })
  linkedInProfileImage: string; 
}

export const UserSchema = SchemaFactory.createForClass(User);

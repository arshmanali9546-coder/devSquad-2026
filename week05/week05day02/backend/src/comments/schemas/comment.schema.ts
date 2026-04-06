import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  postId: string; // the entity being commented on

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  parentCommentId?: Types.ObjectId; // For nested replies

  @Prop({ default: 0 })
  likesCount: number;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

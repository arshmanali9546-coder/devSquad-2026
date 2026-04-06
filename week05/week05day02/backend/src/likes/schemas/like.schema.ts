import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Comment } from '../../comments/schemas/comment.schema';

export type LikeDocument = Like & Document;

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true })
  comment: Comment;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

// Ensure a user only likes a comment once
LikeSchema.index({ user: 1, comment: 1 }, { unique: true });

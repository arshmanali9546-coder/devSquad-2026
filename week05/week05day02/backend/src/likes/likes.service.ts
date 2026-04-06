import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Like, LikeDocument } from './schemas/like.schema';
import { CommentsService } from '../comments/comments.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    private commentsService: CommentsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async toggleLike(userId: string, commentId: string) {
    const existingLike = await this.likeModel.findOne({
      user: userId,
      comment: commentId,
    } as any).exec();

    if (existingLike) {
      // Unlike
      await this.likeModel.findByIdAndDelete(existingLike._id);
      await this.commentsService.decrementLike(commentId);
      return { message: 'Comment unliked' };
    } else {
      // Like
      const like = await new this.likeModel({
        user: new Types.ObjectId(userId),
        comment: new Types.ObjectId(commentId),
      }).save();

      const comment = await this.commentsService.incrementLike(commentId);
      if (!comment) throw new NotFoundException('Comment not found');

      // Notify the comment author
      const targetUserId = comment.author.toString();
      // Dont notify if liking own comment
      if (targetUserId !== userId) {
        this.notificationsGateway.notifyNewLike(targetUserId, userId, commentId);
      }

      return { message: 'Comment liked' };
    }
  }
}

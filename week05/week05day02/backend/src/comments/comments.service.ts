import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createComment(userId: string, postId: string, content: string) {
    const comment = await new this.commentModel({
      author: new Types.ObjectId(userId),
      postId,
      content,
    }).save();

    await comment.populate('author', 'username email profilePicture');
    
    // Notify all users
    this.notificationsGateway.notifyNewComment(postId, comment);

    return comment;
  }

  async replyToComment(userId: string, parentCommentId: string, content: string) {
    const parentComment = await this.commentModel.findById(parentCommentId).exec();
    if (!parentComment) throw new NotFoundException('Comment not found');

    const reply = await new this.commentModel({
      author: new Types.ObjectId(userId),
      postId: parentComment.postId,
      parentCommentId: new Types.ObjectId(parentCommentId),
      content,
    }).save();

    await reply.populate('author', 'username email profilePicture');
    
    // Notify only the user who got the reply
    const targetUserId = parentComment.author.toString();
    this.notificationsGateway.notifyNewReply(targetUserId, reply);

    return reply;
  }

  async getCommentsByPost(postId: string) {
    // Basic fetch without tree building; could aggregate if needed
    return this.commentModel
      .find({ postId })
      .populate('author', 'username email profilePicture')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Used by like service
  async incrementLike(commentId: string) {
    return this.commentModel.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } }, { new: true });
  }

  async decrementLike(commentId: string) {
    return this.commentModel.findByIdAndUpdate(commentId, { $inc: { likesCount: -1 } }, { new: true });
  }

  async updateComment(userId: string, commentId: string, content: string) {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.author.toString() !== userId) {
      throw new Error('Not authorized to edit this comment');
    }

    comment.content = content;
    await comment.save();
    await comment.populate('author', 'username email profilePicture');

    // Notify all users in the same post
    this.notificationsGateway.notifyEditComment(comment.postId, comment);

    return comment;
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.commentModel.findById(commentId).exec();
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.author.toString() !== userId) {
      throw new Error('Not authorized to delete this comment');
    }

    const postId = comment.postId;
    await this.commentModel.findByIdAndDelete(commentId).exec();

    // Optionally: delete replies or mark them as orphaned. 
    // For now, let's just remove the comment and notify everyone.
    this.notificationsGateway.notifyDeleteComment(postId, commentId);

    return { message: 'Comment deleted successfully' };
  }
}

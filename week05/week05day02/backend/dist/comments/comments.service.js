"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("./schemas/comment.schema");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let CommentsService = class CommentsService {
    constructor(commentModel, notificationsGateway) {
        this.commentModel = commentModel;
        this.notificationsGateway = notificationsGateway;
    }
    async createComment(userId, postId, content) {
        const comment = await new this.commentModel({
            author: new mongoose_2.Types.ObjectId(userId),
            postId,
            content,
        }).save();
        await comment.populate('author', 'username email profilePicture');
        this.notificationsGateway.notifyNewComment(postId, comment);
        return comment;
    }
    async replyToComment(userId, parentCommentId, content) {
        const parentComment = await this.commentModel.findById(parentCommentId).exec();
        if (!parentComment)
            throw new common_1.NotFoundException('Comment not found');
        const reply = await new this.commentModel({
            author: new mongoose_2.Types.ObjectId(userId),
            postId: parentComment.postId,
            parentCommentId: new mongoose_2.Types.ObjectId(parentCommentId),
            content,
        }).save();
        await reply.populate('author', 'username email profilePicture');
        const targetUserId = parentComment.author.toString();
        this.notificationsGateway.notifyNewReply(targetUserId, reply);
        return reply;
    }
    async getCommentsByPost(postId) {
        return this.commentModel
            .find({ postId })
            .populate('author', 'username email profilePicture')
            .sort({ createdAt: -1 })
            .exec();
    }
    async incrementLike(commentId) {
        return this.commentModel.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } }, { new: true });
    }
    async decrementLike(commentId) {
        return this.commentModel.findByIdAndUpdate(commentId, { $inc: { likesCount: -1 } }, { new: true });
    }
    async updateComment(userId, commentId, content) {
        const comment = await this.commentModel.findById(commentId).exec();
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.author.toString() !== userId) {
            throw new Error('Not authorized to edit this comment');
        }
        comment.content = content;
        await comment.save();
        await comment.populate('author', 'username email profilePicture');
        this.notificationsGateway.notifyEditComment(comment.postId, comment);
        return comment;
    }
    async deleteComment(userId, commentId) {
        const comment = await this.commentModel.findById(commentId).exec();
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.author.toString() !== userId) {
            throw new Error('Not authorized to delete this comment');
        }
        const postId = comment.postId;
        await this.commentModel.findByIdAndDelete(commentId).exec();
        this.notificationsGateway.notifyDeleteComment(postId, commentId);
        return { message: 'Comment deleted successfully' };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        notifications_gateway_1.NotificationsGateway])
], CommentsService);
//# sourceMappingURL=comments.service.js.map
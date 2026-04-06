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
exports.LikesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const like_schema_1 = require("./schemas/like.schema");
const comments_service_1 = require("../comments/comments.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let LikesService = class LikesService {
    constructor(likeModel, commentsService, notificationsGateway) {
        this.likeModel = likeModel;
        this.commentsService = commentsService;
        this.notificationsGateway = notificationsGateway;
    }
    async toggleLike(userId, commentId) {
        const existingLike = await this.likeModel.findOne({
            user: userId,
            comment: commentId,
        }).exec();
        if (existingLike) {
            await this.likeModel.findByIdAndDelete(existingLike._id);
            await this.commentsService.decrementLike(commentId);
            return { message: 'Comment unliked' };
        }
        else {
            const like = await new this.likeModel({
                user: new mongoose_2.Types.ObjectId(userId),
                comment: new mongoose_2.Types.ObjectId(commentId),
            }).save();
            const comment = await this.commentsService.incrementLike(commentId);
            if (!comment)
                throw new common_1.NotFoundException('Comment not found');
            const targetUserId = comment.author.toString();
            if (targetUserId !== userId) {
                this.notificationsGateway.notifyNewLike(targetUserId, userId, commentId);
            }
            return { message: 'Comment liked' };
        }
    }
};
exports.LikesService = LikesService;
exports.LikesService = LikesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(like_schema_1.Like.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        comments_service_1.CommentsService,
        notifications_gateway_1.NotificationsGateway])
], LikesService);
//# sourceMappingURL=likes.service.js.map
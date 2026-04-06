import { Model } from 'mongoose';
import { LikeDocument } from './schemas/like.schema';
import { CommentsService } from '../comments/comments.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class LikesService {
    private likeModel;
    private commentsService;
    private notificationsGateway;
    constructor(likeModel: Model<LikeDocument>, commentsService: CommentsService, notificationsGateway: NotificationsGateway);
    toggleLike(userId: string, commentId: string): Promise<{
        message: string;
    }>;
}

import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class CommentsService {
    private commentModel;
    private notificationsGateway;
    constructor(commentModel: Model<CommentDocument>, notificationsGateway: NotificationsGateway);
    createComment(userId: string, postId: string, content: string): Promise<import("mongoose").Document<unknown, {}, CommentDocument, {}, import("mongoose").DefaultSchemaOptions> & Comment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    replyToComment(userId: string, parentCommentId: string, content: string): Promise<import("mongoose").Document<unknown, {}, CommentDocument, {}, import("mongoose").DefaultSchemaOptions> & Comment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getCommentsByPost(postId: string): Promise<(import("mongoose").Document<unknown, {}, CommentDocument, {}, import("mongoose").DefaultSchemaOptions> & Comment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    incrementLike(commentId: string): Promise<import("mongoose").Document<unknown, {}, CommentDocument, {}, import("mongoose").DefaultSchemaOptions> & Comment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    decrementLike(commentId: string): Promise<import("mongoose").Document<unknown, {}, CommentDocument, {}, import("mongoose").DefaultSchemaOptions> & Comment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    updateComment(userId: string, commentId: string, content: string): Promise<import("mongoose").Document<unknown, {}, CommentDocument, {}, import("mongoose").DefaultSchemaOptions> & Comment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteComment(userId: string, commentId: string): Promise<{
        message: string;
    }>;
}

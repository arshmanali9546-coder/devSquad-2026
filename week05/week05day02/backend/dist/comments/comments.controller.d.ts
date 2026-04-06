import { CommentsService } from './comments.service';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    createComment(req: any, body: {
        postId: string;
        content: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/comment.schema").CommentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/comment.schema").Comment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    replyToComment(req: any, id: string, body: {
        content: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/comment.schema").CommentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/comment.schema").Comment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getCommentsByPost(postId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/comment.schema").CommentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/comment.schema").Comment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateComment(req: any, id: string, body: {
        content: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/comment.schema").CommentDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/comment.schema").Comment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    deleteComment(req: any, id: string): Promise<{
        message: string;
    }>;
}

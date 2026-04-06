import mongoose, { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Comment } from '../../comments/schemas/comment.schema';
export type LikeDocument = Like & Document;
export declare class Like {
    user: User;
    comment: Comment;
}
export declare const LikeSchema: mongoose.Schema<Like, mongoose.Model<Like, any, any, any, (mongoose.Document<unknown, any, Like, any, mongoose.DefaultSchemaOptions> & Like & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (mongoose.Document<unknown, any, Like, any, mongoose.DefaultSchemaOptions> & Like & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Like>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Like, mongoose.Document<unknown, {}, Like, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Like & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    user?: mongoose.SchemaDefinitionProperty<User, Like, mongoose.Document<unknown, {}, Like, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Like & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    comment?: mongoose.SchemaDefinitionProperty<Comment, Like, mongoose.Document<unknown, {}, Like, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Like & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Like>;

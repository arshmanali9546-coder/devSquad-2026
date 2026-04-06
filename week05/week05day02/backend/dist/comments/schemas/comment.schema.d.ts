import mongoose, { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export type CommentDocument = Comment & Document;
export declare class Comment {
    author: User;
    content: string;
    postId: string;
    parentCommentId?: Types.ObjectId;
    likesCount: number;
}
export declare const CommentSchema: mongoose.Schema<Comment, mongoose.Model<Comment, any, any, any, (mongoose.Document<unknown, any, Comment, any, mongoose.DefaultSchemaOptions> & Comment & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (mongoose.Document<unknown, any, Comment, any, mongoose.DefaultSchemaOptions> & Comment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Comment>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Comment, mongoose.Document<unknown, {}, Comment, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Comment & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    author?: mongoose.SchemaDefinitionProperty<User, Comment, mongoose.Document<unknown, {}, Comment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Comment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    content?: mongoose.SchemaDefinitionProperty<string, Comment, mongoose.Document<unknown, {}, Comment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Comment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    postId?: mongoose.SchemaDefinitionProperty<string, Comment, mongoose.Document<unknown, {}, Comment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Comment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    parentCommentId?: mongoose.SchemaDefinitionProperty<Types.ObjectId, Comment, mongoose.Document<unknown, {}, Comment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Comment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
    likesCount?: mongoose.SchemaDefinitionProperty<number, Comment, mongoose.Document<unknown, {}, Comment, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Comment & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }>;
}, Comment>;

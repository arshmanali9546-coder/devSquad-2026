import { User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: any): Promise<User>;
    findOneByUsername(username: string): Promise<UserDocument | null>;
    findOneByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    follow(followerId: string, targetUserId: string): Promise<{
        message: string;
    }>;
    unfollow(followerId: string, targetUserId: string): Promise<{
        message: string;
    }>;
    updateProfile(userId: string, updateData: {
        username?: string;
        email?: string;
        bio?: string;
        profilePicture?: string;
    }): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

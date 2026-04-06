import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<import("./schemas/user.schema").UserDocument>;
    getUserProfile(id: string): Promise<import("./schemas/user.schema").UserDocument>;
    followUser(req: any, id: string): Promise<{
        message: string;
    }>;
    unfollowUser(req: any, id: string): Promise<{
        message: string;
    }>;
    updateProfile(req: any, body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}

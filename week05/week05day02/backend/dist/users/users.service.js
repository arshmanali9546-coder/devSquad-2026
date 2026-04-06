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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./schemas/user.schema");
const mongoose_2 = require("mongoose");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }
    async findOneByUsername(username) {
        return this.userModel.findOne({ username }).exec();
    }
    async findOneByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findById(id) {
        return this.userModel.findById(id).select('-password').exec();
    }
    async follow(followerId, targetUserId) {
        if (followerId === targetUserId) {
            throw new Error('You cannot follow yourself');
        }
        const tId = new mongoose_2.Types.ObjectId(targetUserId);
        const fId = new mongoose_2.Types.ObjectId(followerId);
        const targetUser = await this.userModel.findById(tId);
        if (!targetUser)
            throw new common_1.NotFoundException('User not found');
        if (!targetUser.followers.includes(fId)) {
            targetUser.followers.push(fId);
            await targetUser.save();
            await this.userModel.findByIdAndUpdate(fId, {
                $addToSet: { following: tId }
            });
        }
        return { message: 'Successfully followed user' };
    }
    async unfollow(followerId, targetUserId) {
        const tId = new mongoose_2.Types.ObjectId(targetUserId);
        const fId = new mongoose_2.Types.ObjectId(followerId);
        const targetUser = await this.userModel.findById(tId);
        if (!targetUser)
            throw new common_1.NotFoundException('User not found');
        const followerIndex = targetUser.followers.indexOf(fId);
        if (followerIndex > -1) {
            targetUser.followers.splice(followerIndex, 1);
            await targetUser.save();
            await this.userModel.findByIdAndUpdate(fId, {
                $pull: { following: tId }
            });
        }
        return { message: 'Successfully unfollowed user' };
    }
    async updateProfile(userId, updateData) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (updateData.username && updateData.username !== user.username) {
            const existing = await this.findOneByUsername(updateData.username);
            if (existing)
                throw new Error('Username already taken');
            user.username = updateData.username;
        }
        if (updateData.email && updateData.email !== user.email) {
            const existing = await this.findOneByEmail(updateData.email);
            if (existing)
                throw new Error('Email already taken');
            user.email = updateData.email;
        }
        if (updateData.bio !== undefined)
            user.bio = updateData.bio;
        if (updateData.profilePicture !== undefined)
            user.profilePicture = updateData.profilePicture;
        return user.save();
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map
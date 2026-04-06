import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findOneByUsername(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async follow(followerId: string, targetUserId: string) {
    if (followerId === targetUserId) {
      throw new Error('You cannot follow yourself');
    }

    const tId = new Types.ObjectId(targetUserId);
    const fId = new Types.ObjectId(followerId);

    const targetUser = await this.userModel.findById(tId);
    if (!targetUser) throw new NotFoundException('User not found');

    if (!targetUser.followers.includes(fId)) {
      targetUser.followers.push(fId);
      await targetUser.save();
      
      await this.userModel.findByIdAndUpdate(fId, {
        $addToSet: { following: tId }
      });
    }

    return { message: 'Successfully followed user' };
  }

  async unfollow(followerId: string, targetUserId: string) {
    const tId = new Types.ObjectId(targetUserId);
    const fId = new Types.ObjectId(followerId);

    const targetUser = await this.userModel.findById(tId);
    if (!targetUser) throw new NotFoundException('User not found');

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

  async updateProfile(userId: string, updateData: { username?: string; email?: string; bio?: string; profilePicture?: string }) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (updateData.username && updateData.username !== user.username) {
      const existing = await this.findOneByUsername(updateData.username);
      if (existing) throw new Error('Username already taken');
      user.username = updateData.username;
    }

    if (updateData.email && updateData.email !== user.email) {
      const existing = await this.findOneByEmail(updateData.email);
      if (existing) throw new Error('Email already taken');
      user.email = updateData.email;
    }

    if (updateData.bio !== undefined) user.bio = updateData.bio;
    if (updateData.profilePicture !== undefined) user.profilePicture = updateData.profilePicture;

    return user.save();
  }
}

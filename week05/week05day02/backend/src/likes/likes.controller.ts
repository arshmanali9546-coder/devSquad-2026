import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':commentId/toggle')
  toggleLike(@Request() req: any, @Param('commentId') commentId: string) {
    return this.likesService.toggleLike(req.user.userId, commentId);
  }
}

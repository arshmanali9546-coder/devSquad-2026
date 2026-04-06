import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createComment(@Request() req: any, @Body() body: { postId: string; content: string }) {
    return this.commentsService.createComment(req.user.userId, body.postId, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reply')
  replyToComment(@Request() req: any, @Param('id') id: string, @Body() body: { content: string }) {
    return this.commentsService.replyToComment(req.user.userId, id, body.content);
  }

  @Get('post/:postId')
  getCommentsByPost(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateComment(@Request() req: any, @Param('id') id: string, @Body() body: { content: string }) {
    return this.commentsService.updateComment(req.user.userId, id, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteComment(@Request() req: any, @Param('id') id: string) {
    return this.commentsService.deleteComment(req.user.userId, id);
  }
}

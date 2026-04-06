import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private connectedUsers = new Map<string, string>(); // map userId to socketId

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  handleConnection(client: Socket) {
    // In a real app, you'd extract userId from client.handshake.query or headers auth token
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      console.log(`User ${userId} connected as ${client.id}`);
    } else {
      console.log(`Client connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.delete(userId);
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  // Broadcase to everyone
  notifyNewComment(postId: string, comment: any) {
    this.server.emit('newComment', { postId, comment });
  }

  // Notify specific user
  notifyNewReply(targetUserId: string, reply: any) {
    const socketId = this.connectedUsers.get(targetUserId);
    if (socketId) {
      this.server.to(socketId).emit('newReply', { reply });
    } else {
      // User not online, but might want to store in DB here if we needed persistence
      console.log(`User ${targetUserId} not online for reply notification`);
    }
  }

  // Notify specific user
  notifyNewLike(targetUserId: string, likerId: string, commentId: string) {
    const socketId = this.connectedUsers.get(targetUserId);
    if (socketId) {
      this.server.to(socketId).emit('newLike', { likerId, commentId });
    }
  }

  // Broadcast edit
  notifyEditComment(postId: string, comment: any) {
    this.server.emit('editComment', { postId, comment });
  }

  // Broadcast delete
  notifyDeleteComment(postId: string, commentId: string) {
    this.server.emit('deleteComment', { postId, commentId });
  }
}

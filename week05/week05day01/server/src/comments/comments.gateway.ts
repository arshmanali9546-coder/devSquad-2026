import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  clientId: string; // Used to identify who sent it
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private comments: Comment[] = [];

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Send existing comments to the newly connected client
    client.emit('initial_comments', this.comments);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('add_comment')
  handleAddComment(
    @MessageBody() data: { text: string; author: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Received comment from ${client.id}:`, data);
    
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      text: data.text,
      author: data.author || 'Anonymous',
      timestamp: new Date().toISOString(),
      clientId: client.id,
    };

    this.comments.push(newComment);

    // Broadcast the new comment to ALL connected clients
    this.server.emit('new_comment', newComment);
    
    return { event: 'comment_added', data: newComment };
  }

  @SubscribeMessage('update_comment')
  handleUpdateComment(
    @MessageBody() data: { id: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    const commentIndex = this.comments.findIndex(c => c.id === data.id);
    
    if (commentIndex === -1) {
      return { event: 'error', message: 'Comment not found' };
    }

    this.comments[commentIndex].text = data.text;
    // We could add an 'editedAt' or just update the timestamp
    
    this.server.emit('comment_updated', this.comments[commentIndex]);
    return { event: 'comment_updated', data: this.comments[commentIndex] };
  }

  @SubscribeMessage('delete_comment')
  handleDeleteComment(
    @MessageBody() data: { id: string },
    @ConnectedSocket() client: Socket,
  ) {
    const commentIndex = this.comments.findIndex(c => c.id === data.id);
    
    if (commentIndex === -1) {
      return { event: 'error', message: 'Comment not found' };
    }

    const deletedId = this.comments[commentIndex].id;
    this.comments = this.comments.filter(c => c.id !== data.id);

    this.server.emit('comment_deleted', deletedId);
    return { event: 'comment_deleted', data: deletedId };
  }
}

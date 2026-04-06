import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private connectedUsers;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    notifyNewComment(postId: string, comment: any): void;
    notifyNewReply(targetUserId: string, reply: any): void;
    notifyNewLike(targetUserId: string, likerId: string, commentId: string): void;
    notifyEditComment(postId: string, comment: any): void;
    notifyDeleteComment(postId: string, commentId: string): void;
}

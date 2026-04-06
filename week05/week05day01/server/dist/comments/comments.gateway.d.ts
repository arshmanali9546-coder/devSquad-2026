import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
interface Comment {
    id: string;
    text: string;
    author: string;
    timestamp: string;
    clientId: string;
}
export declare class CommentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private comments;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleAddComment(data: {
        text: string;
        author: string;
    }, client: Socket): {
        event: string;
        data: Comment;
    };
    handleUpdateComment(data: {
        id: string;
        text: string;
    }, client: Socket): {
        event: string;
        message: string;
        data?: undefined;
    } | {
        event: string;
        data: Comment;
        message?: undefined;
    };
    handleDeleteComment(data: {
        id: string;
    }, client: Socket): {
        event: string;
        message: string;
        data?: undefined;
    } | {
        event: string;
        data: string;
        message?: undefined;
    };
}
export {};

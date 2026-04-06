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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let NotificationsGateway = class NotificationsGateway {
    constructor() {
        this.connectedUsers = new Map();
    }
    afterInit(server) {
        console.log('WebSocket Gateway Initialized');
    }
    handleConnection(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            this.connectedUsers.set(userId, client.id);
            console.log(`User ${userId} connected as ${client.id}`);
        }
        else {
            console.log(`Client connected: ${client.id}`);
        }
    }
    handleDisconnect(client) {
        const userId = client.handshake.query.userId;
        if (userId) {
            this.connectedUsers.delete(userId);
        }
        console.log(`Client disconnected: ${client.id}`);
    }
    notifyNewComment(postId, comment) {
        this.server.emit('newComment', { postId, comment });
    }
    notifyNewReply(targetUserId, reply) {
        const socketId = this.connectedUsers.get(targetUserId);
        if (socketId) {
            this.server.to(socketId).emit('newReply', { reply });
        }
        else {
            console.log(`User ${targetUserId} not online for reply notification`);
        }
    }
    notifyNewLike(targetUserId, likerId, commentId) {
        const socketId = this.connectedUsers.get(targetUserId);
        if (socketId) {
            this.server.to(socketId).emit('newLike', { likerId, commentId });
        }
    }
    notifyEditComment(postId, comment) {
        this.server.emit('editComment', { postId, comment });
    }
    notifyDeleteComment(postId, commentId) {
        this.server.emit('deleteComment', { postId, commentId });
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map
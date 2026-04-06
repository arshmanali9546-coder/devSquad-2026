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
exports.CommentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let CommentsGateway = class CommentsGateway {
    constructor() {
        this.comments = [];
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
        client.emit('initial_comments', this.comments);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
    handleAddComment(data, client) {
        console.log(`Received comment from ${client.id}:`, data);
        const newComment = {
            id: Math.random().toString(36).substring(2, 9),
            text: data.text,
            author: data.author || 'Anonymous',
            timestamp: new Date().toISOString(),
            clientId: client.id,
        };
        this.comments.push(newComment);
        this.server.emit('new_comment', newComment);
        return { event: 'comment_added', data: newComment };
    }
    handleUpdateComment(data, client) {
        const commentIndex = this.comments.findIndex(c => c.id === data.id);
        if (commentIndex === -1) {
            return { event: 'error', message: 'Comment not found' };
        }
        this.comments[commentIndex].text = data.text;
        this.server.emit('comment_updated', this.comments[commentIndex]);
        return { event: 'comment_updated', data: this.comments[commentIndex] };
    }
    handleDeleteComment(data, client) {
        const commentIndex = this.comments.findIndex(c => c.id === data.id);
        if (commentIndex === -1) {
            return { event: 'error', message: 'Comment not found' };
        }
        const deletedId = this.comments[commentIndex].id;
        this.comments = this.comments.filter(c => c.id !== data.id);
        this.server.emit('comment_deleted', deletedId);
        return { event: 'comment_deleted', data: deletedId };
    }
};
exports.CommentsGateway = CommentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CommentsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('add_comment'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "handleAddComment", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('update_comment'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "handleUpdateComment", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('delete_comment'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], CommentsGateway.prototype, "handleDeleteComment", null);
exports.CommentsGateway = CommentsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    })
], CommentsGateway);
//# sourceMappingURL=comments.gateway.js.map
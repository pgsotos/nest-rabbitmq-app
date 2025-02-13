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
exports.RabbitMQController = void 0;
const common_1 = require("@nestjs/common");
const rabbitmq_service_1 = require("./rabbitmq.service");
const swagger_1 = require("@nestjs/swagger");
let RabbitMQController = class RabbitMQController {
    constructor(rabbitMQService) {
        this.rabbitMQService = rabbitMQService;
    }
    async publishMessage(queue, message) {
        return await this.rabbitMQService.publishMessage(queue, message);
    }
    async consumeMessages(queue) {
        const messages = [];
        await this.rabbitMQService.consumeMessages(queue, (message) => {
            console.log('Received message:', message);
            messages.push(message);
        });
        return { success: true, message: 'Message consumption started successfully. Check server logs for received messages.' };
    }
};
exports.RabbitMQController = RabbitMQController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Publish a message to a RabbitMQ queue' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                queue: { type: 'string', description: 'The name of the queue' },
                message: { type: 'string', description: 'The message to publish' },
            },
            required: ['queue', 'message'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message published successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    (0, common_1.Post)('publish'),
    __param(0, (0, common_1.Body)('queue')),
    __param(1, (0, common_1.Body)('message')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RabbitMQController.prototype, "publishMessage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Consume messages from a RabbitMQ queue' }),
    (0, swagger_1.ApiQuery)({ name: 'queue', description: 'The name of the queue to consume from' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Message consumption started successfully' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    (0, common_1.Get)('consume'),
    __param(0, (0, common_1.Query)('queue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RabbitMQController.prototype, "consumeMessages", null);
exports.RabbitMQController = RabbitMQController = __decorate([
    (0, swagger_1.ApiTags)('RabbitMQ'),
    (0, common_1.Controller)('rabbitmq'),
    __metadata("design:paramtypes", [rabbitmq_service_1.RabbitMQService])
], RabbitMQController);
//# sourceMappingURL=rabbitmq.controller.js.map
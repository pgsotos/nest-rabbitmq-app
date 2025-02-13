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
exports.RabbitMQService = void 0;
const common_1 = require("@nestjs/common");
const amqp = require("amqplib");
let RabbitMQService = class RabbitMQService {
    constructor() {
        this.amqpUrl = 'amqp://localhost';
    }
    async onModuleInit() {
        try {
            this.connection = await amqp.connect(this.amqpUrl);
            this.channel = await this.connection.createChannel();
        }
        catch (error) {
            console.error('Failed to connect to RabbitMQ', error);
            throw error;
        }
    }
    async onModuleDestroy() {
        var _a, _b;
        try {
            await ((_a = this.channel) === null || _a === void 0 ? void 0 : _a.close());
            await ((_b = this.connection) === null || _b === void 0 ? void 0 : _b.close());
        }
        catch (error) {
            console.error('Error closing RabbitMQ connection', error);
        }
    }
    async publishMessage(queue, message) {
        try {
            await this.channel.assertQueue(queue, { durable: false });
            this.channel.sendToQueue(queue, Buffer.from(message));
            console.log(`[RabbitMQ] Published message to queue '${queue}':`, message);
            return { success: true, message: 'Message sent successfully' };
        }
        catch (error) {
            console.error('Error publishing message', error);
            throw error;
        }
    }
    async consumeMessages(queue, callback) {
        try {
            await this.channel.assertQueue(queue, { durable: false });
            console.log(`[RabbitMQ] Started consuming messages from queue '${queue}'`);
            this.channel.consume(queue, (msg) => {
                if (msg) {
                    const content = msg.content.toString();
                    console.log(`[RabbitMQ] Received message from queue '${queue}':`, content);
                    callback(content);
                    this.channel.ack(msg);
                }
            });
        }
        catch (error) {
            console.error('Error consuming messages', error);
            throw error;
        }
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RabbitMQService);
//# sourceMappingURL=rabbitmq.service.js.map
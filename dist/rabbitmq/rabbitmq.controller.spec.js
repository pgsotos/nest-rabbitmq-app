"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const rabbitmq_controller_1 = require("./rabbitmq.controller");
const rabbitmq_service_1 = require("./rabbitmq.service");
describe('RabbitMQController', () => {
    let controller;
    let service;
    beforeEach(async () => {
        service = {
            publishMessage: jest.fn(),
            consumeMessages: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            controllers: [rabbitmq_controller_1.RabbitMQController],
            providers: [
                {
                    provide: rabbitmq_service_1.RabbitMQService,
                    useValue: service,
                },
            ],
        }).compile();
        controller = module.get(rabbitmq_controller_1.RabbitMQController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('publishMessage', () => {
        it('should publish message successfully', async () => {
            const queue = 'test-queue';
            const message = 'test-message';
            const expectedResponse = { success: true, message: 'Message sent successfully' };
            service.publishMessage.mockResolvedValue(expectedResponse);
            const result = await controller.publishMessage(queue, message);
            expect(service.publishMessage).toHaveBeenCalledWith(queue, message);
            expect(result).toEqual(expectedResponse);
        });
        it('should handle publish errors', async () => {
            const queue = 'test-queue';
            const message = 'test-message';
            const error = new Error('Publishing failed');
            service.publishMessage.mockRejectedValue(error);
            await expect(controller.publishMessage(queue, message)).rejects.toThrow(error);
            expect(service.publishMessage).toHaveBeenCalledWith(queue, message);
        });
    });
    describe('consumeMessages', () => {
        it('should start consuming messages successfully', async () => {
            const queue = 'test-queue';
            const expectedResponse = {
                success: true,
                message: 'Message consumption started successfully. Check server logs for received messages.',
            };
            service.consumeMessages.mockImplementation(async (q, callback) => {
                callback('test message');
            });
            const result = await controller.consumeMessages(queue);
            expect(service.consumeMessages).toHaveBeenCalledWith(queue, expect.any(Function));
            expect(result).toEqual(expectedResponse);
        });
        it('should handle consume errors', async () => {
            const queue = 'test-queue';
            const error = new Error('Consuming failed');
            service.consumeMessages.mockRejectedValue(error);
            await expect(controller.consumeMessages(queue)).rejects.toThrow(error);
            expect(service.consumeMessages).toHaveBeenCalledWith(queue, expect.any(Function));
        });
    });
});
//# sourceMappingURL=rabbitmq.controller.spec.js.map
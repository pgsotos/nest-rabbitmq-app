import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQService } from './rabbitmq.service';
import * as amqp from 'amqplib';

describe('RabbitMQService', () => {
  let service: RabbitMQService;
  let mockChannel;
  let mockConnection;

  beforeEach(async () => {
    // Create mock objects before each test
    mockChannel = {
      assertQueue: jest.fn().mockResolvedValue({ queue: 'test-queue', messageCount: 0, consumerCount: 0 }),
      sendToQueue: jest.fn(),
      consume: jest.fn(),
      ack: jest.fn(),
      close: jest.fn(),
    };

    mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
      close: jest.fn(),
    };

    // Mock the amqplib connect function
    const mockConnect = jest.fn().mockResolvedValue(mockConnection);
jest.spyOn(amqp, 'connect').mockImplementation(mockConnect);

    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitMQService],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
    await service.onModuleInit();
  });

  afterEach(async () => {
    await service.onModuleDestroy();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should connect to RabbitMQ and create a channel', async () => {
      expect(amqp.connect).toHaveBeenCalledWith('amqp://localhost');
      expect(mockConnection.createChannel).toHaveBeenCalled();
    });

    it('should throw error when connection fails', async () => {
      const error = new Error('Connection failed');
      jest.spyOn(amqp, 'connect').mockRejectedValueOnce(error);
      const newService = new RabbitMQService();
      await expect(newService.onModuleInit()).rejects.toThrow('Connection failed');
    });
  });

  describe('publishMessage', () => {
    it('should publish message to queue successfully', async () => {
      const queue = 'test-queue';
      const message = 'test-message';

      const result = await service.publishMessage(queue, message);

      expect(mockChannel.assertQueue).toHaveBeenCalledWith(queue, { durable: false });
      expect(mockChannel.sendToQueue).toHaveBeenCalledWith(queue, Buffer.from(message));
      expect(result).toEqual({ success: true, message: 'Message sent successfully' });
    });

    it('should throw error when publishing fails', async () => {
      const queue = 'test-queue';
      const message = 'test-message';
      const error = new Error('Publishing failed');

      mockChannel.assertQueue.mockRejectedValueOnce(error);

      await expect(service.publishMessage(queue, message)).rejects.toThrow('Publishing failed');
    });
  });

  describe('consumeMessages', () => {
    it('should consume messages from queue successfully', async () => {
      const queue = 'test-queue';
      const callback = jest.fn();
      const testMessage = 'test-message';

      await service.consumeMessages(queue, callback);

      expect(mockChannel.assertQueue).toHaveBeenCalledWith(queue, { durable: false });
      expect(mockChannel.consume).toHaveBeenCalledWith(queue, expect.any(Function));

      // Simulate receiving a message
      const consumeCallback = mockChannel.consume.mock.calls[0][1];
      consumeCallback({ content: Buffer.from(testMessage) });

      expect(callback).toHaveBeenCalledWith(testMessage);
      expect(mockChannel.ack).toHaveBeenCalled();
    });

    it('should handle null messages gracefully', async () => {
      const queue = 'test-queue';
      const callback = jest.fn();

      await service.consumeMessages(queue, callback);

      const consumeCallback = mockChannel.consume.mock.calls[0][1];
      consumeCallback(null);

      expect(callback).not.toHaveBeenCalled();
      expect(mockChannel.ack).not.toHaveBeenCalled();
    });

    it('should throw error when consuming fails', async () => {
      const queue = 'test-queue';
      const callback = jest.fn();
      const error = new Error('Consuming failed');

      mockChannel.assertQueue.mockRejectedValueOnce(error);

      await expect(service.consumeMessages(queue, callback)).rejects.toThrow('Consuming failed');
    });
  });
});
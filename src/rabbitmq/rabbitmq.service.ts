import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly amqpUrl: string = 'amqp://localhost';

  constructor() {}

  async onModuleInit() {
    try {
      // Use the injected connection for testing, or create a new one
      this.connection = await amqp.connect(this.amqpUrl);
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      console.error('Error closing RabbitMQ connection', error);
    }
  }

  async publishMessage(queue: string, message: string): Promise<{ success: boolean; message: string }> {
    try {
      await this.channel.assertQueue(queue, { durable: false });
      this.channel.sendToQueue(queue, Buffer.from(message));
      console.log(`[RabbitMQ] Published message to queue '${queue}':`, message);
      return { success: true, message: 'Message sent successfully' };
    } catch (error) {
      console.error('Error publishing message', error);
      throw error;
    }
  }

  async consumeMessages(queue: string, callback: (message: string) => void): Promise<void> {
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
    } catch (error) {
      console.error('Error consuming messages', error);
      throw error;
    }
  }
}
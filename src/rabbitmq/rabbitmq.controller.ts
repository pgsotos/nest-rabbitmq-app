import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';

@ApiTags('RabbitMQ')
@Controller('rabbitmq')
export class RabbitMQController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @ApiOperation({ summary: 'Publish a message to a RabbitMQ queue' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        queue: { type: 'string', description: 'The name of the queue' },
        message: { type: 'string', description: 'The message to publish' },
      },
      required: ['queue', 'message'],
    },
  })
  @ApiResponse({ status: 200, description: 'Message published successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('publish')
  async publishMessage(
    @Body('queue') queue: string,
    @Body('message') message: string,
  ): Promise<{ success: boolean; message: string }> {
    return await this.rabbitMQService.publishMessage(queue, message);
  }

  @ApiOperation({ summary: 'Consume messages from a RabbitMQ queue' })
  @ApiQuery({ name: 'queue', description: 'The name of the queue to consume from' })
  @ApiResponse({ status: 200, description: 'Message consumption started successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('consume')
  async consumeMessages(
    @Query('queue') queue: string,
  ): Promise<{ success: boolean; message: string }> {
    const messages: string[] = [];
    await this.rabbitMQService.consumeMessages(queue, (message) => {
      console.log('Received message:', message);
      messages.push(message);
    });
    return { success: true, message: 'Message consumption started successfully. Check server logs for received messages.' };
  }
}
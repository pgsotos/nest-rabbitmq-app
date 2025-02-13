import { RabbitMQService } from './rabbitmq.service';
export declare class RabbitMQController {
    private readonly rabbitMQService;
    constructor(rabbitMQService: RabbitMQService);
    publishMessage(queue: string, message: string): Promise<{
        success: boolean;
        message: string;
    }>;
    consumeMessages(queue: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

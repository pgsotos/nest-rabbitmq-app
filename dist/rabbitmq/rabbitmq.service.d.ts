import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
export declare class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private connection;
    private channel;
    private readonly amqpUrl;
    constructor();
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    publishMessage(queue: string, message: string): Promise<{
        success: boolean;
        message: string;
    }>;
    consumeMessages(queue: string, callback: (message: string) => void): Promise<void>;
}

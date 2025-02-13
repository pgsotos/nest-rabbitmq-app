# NestJS RabbitMQ Service

This is a NestJS application that implements a message queue system using RabbitMQ. It provides REST API endpoints for publishing and consuming messages through RabbitMQ queues.

## Features

- Publish messages to RabbitMQ queues
- Consume messages from RabbitMQ queues
- Swagger API documentation
- Docker support

## Prerequisites

- Node.js (v14 or higher)
- RabbitMQ server running locally or via Docker
- Docker and Docker Compose (optional)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Local Development

1. Start the application:
   ```bash
   npm run start:dev
   ```
2. The application will be available at http://localhost:3000
3. Swagger documentation will be available at http://localhost:3000/api

### Using Docker

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```
2. The application will be available at http://localhost:3000

## API Endpoints

### Publish Message

```
POST /rabbitmq/publish
```

Request body:
```json
{
  "queue": "string",
  "message": "string"
}
```

Response:
```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

### Consume Messages

```
GET /rabbitmq/consume?queue=queue_name
```

Query parameters:
- `queue`: The name of the queue to consume messages from

Response:
```json
{
  "success": true,
  "message": "Message consumption started successfully. Check server logs for received messages."
}
```

## Error Handling

The application includes error handling for common scenarios:
- RabbitMQ connection failures
- Queue assertion errors
- Message publishing/consuming errors

## License

MIT
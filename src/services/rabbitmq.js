import amqp from 'amqplib';

let channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect('amqp://localhost');
  channel = await connection.createChannel();
  console.log('Connected to RabbitMQ');
};

export const sendToQueue = async (queue, message) => {
  if (!channel) throw new Error('RabbitMQ channel is not initialized');
  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
};

await connectRabbitMQ();

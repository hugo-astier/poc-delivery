import amqp from 'amqplib';
import { query } from '../src/services/db.js'; // Connexion à PostgreSQL

const RABBITMQ_URL = 'amqp://localhost:5672';

async function startWorker() {
  try {
    // Connexion à RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    const queue = 'delivery_tracking';

    // Assure que la queue existe
    await channel.assertQueue(queue, { durable: true });

    console.log(`✅ Worker en écoute sur la queue: ${queue}`);

    // Écoute et traite les messages
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const delivery = JSON.parse(msg.content.toString());
        console.log('📩 Message reçu:', delivery);

        // Simule un traitement (Ex: stockage en base)
        await query('UPDATE deliveries SET status = $1 WHERE id = $2', ['processed', delivery.id]);

        // Accuse traitement du message
        channel.ack(msg);
        console.log('✅ Message traité');
      }
    });
  } catch (error) {
    console.error('❌ Erreur dans le worker:', error);
  }
}

// Lancer le worker
startWorker();

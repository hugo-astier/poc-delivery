import express from 'express';
import { query } from '../services/db.js';
import redis from '../services/redis.js';
import { sendToQueue } from '../services/rabbitmq.js';

const router = express.Router();

// Get all deliveries (with Redis caching)
router.get('/', async (req, res) => {
  try {
    const cached = await redis.get('deliveries');
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const result = await query('SELECT * FROM deliveries');
    const deliveries = result.rows;

    await redis.set('deliveries', JSON.stringify(deliveries), { EX: 60 }); // Cache for 60 seconds

    res.json(deliveries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new delivery
router.post('/', async (req, res) => {
  const { description } = req.body;

  try {
    const result = await query('INSERT INTO deliveries (description) VALUES ($1) RETURNING *', [description]);
    const newDelivery = result.rows[0];

    // Send to RabbitMQ for background processing
    await sendToQueue('delivery_tracking', newDelivery);

    res.status(201).json(newDelivery);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

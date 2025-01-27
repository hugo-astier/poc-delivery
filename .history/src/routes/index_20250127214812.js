import express from 'express';

import UserRoutes from '@/routes/user.js';
import DeliveriesRoutes from '@/routes/deliveries.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('This is the API root!');
});

router.use('/users', UserRoutes);

router.use('/delivery', DeliveriesRoutes);

export default router;

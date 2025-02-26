import express from 'express';
import OrderController from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const setOrderRoutes = (app) => {
  const router = express.Router();
  const orderController = new OrderController();

  router.post('/orders', authMiddleware, (req, res) => orderController.createOrder(req, res));
  router.get('/orders', authMiddleware, (req, res) => orderController.getUserOrders(req, res));

  app.use('/api', router);
};

export default setOrderRoutes;

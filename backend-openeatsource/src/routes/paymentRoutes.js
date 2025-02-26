import express from 'express';
import PaymentController from '../controllers/paymentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const setPaymentRoutes = (app) => {
  const router = express.Router();
  const paymentController = new PaymentController();

  router.post('/payment-methods', authMiddleware, (req, res) => paymentController.addPaymentMethod(req, res));
  router.get('/payment-methods', authMiddleware, (req, res) => paymentController.getPaymentMethods(req, res));
  router.delete('/payment-methods/:paymentMethodId', authMiddleware, (req, res) => paymentController.deletePaymentMethod(req, res));
  router.put('/payment-methods/:paymentMethodId/default', authMiddleware, (req, res) => paymentController.toggleDefaultPaymentMethod(req, res));

  app.use('/api', router);
};

export default setPaymentRoutes;

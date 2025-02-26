import express from 'express';
import AddressController from '../controllers/addressController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const setAddressRoutes = (app) => {
  const router = express.Router();
  const addressController = new AddressController();

  router.get('/addresses', authMiddleware, (req, res) => addressController.getAddresses(req, res));
  router.get('/addresses/:addressId', authMiddleware, (req, res) => addressController.getAddress(req, res));
  router.post('/addresses', authMiddleware, (req, res) => addressController.addAddress(req, res));
  router.delete('/addresses/:addressId', authMiddleware, (req, res) => addressController.deleteAddress(req, res));

  app.use('/api', router);
};

export default setAddressRoutes;

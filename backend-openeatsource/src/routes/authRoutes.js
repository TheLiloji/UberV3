import express from 'express';
import AuthController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const setAuthRoutes = (app) => {
  const router = express.Router();
  const authController = new AuthController();

  router.post('/register', (req, res) => {
    const { firstName, lastName, avatarUrl, savedAddresses } = req.body;
    authController.register(req, res, firstName, lastName, avatarUrl, savedAddresses);
  });
  router.post('/login', (req, res) => authController.login(req, res));
  router.put('/account', authMiddleware, (req, res) => {
    const { firstName, lastName, avatarUrl } = req.body;
    authController.updateAccount(req, res, firstName, lastName, avatarUrl);
  });
  router.get('/profile', authMiddleware, (req, res) => authController.getUserProfile(req, res));

  app.use('/api/auth', router);
};

export default setAuthRoutes;

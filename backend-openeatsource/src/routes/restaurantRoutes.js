import express from 'express';
import RestaurantController from '../controllers/restaurantController.js';

const setRestaurantRoutes = (app) => {
  const router = express.Router();
  const restaurantController = new RestaurantController();

  router.get('/restaurant', (req, res) => restaurantController.getRestaurant(req, res));
  router.get('/restaurants', (req, res) => restaurantController.getAllRestaurants(req, res));

  app.use('/api', router);
};

export default setRestaurantRoutes;

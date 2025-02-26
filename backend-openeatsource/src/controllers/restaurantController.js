import { database, ref, get, child } from '../config/firebaseConfig.js';

class RestaurantController {
  async getRestaurant(req, res) {
    const restaurantId = req.query.restaurantId;
    if (!restaurantId) {
      return res.status(400).json({ message: 'restaurantId query parameter is required' });
    }

    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `restaurants/${restaurantId}`));
      const restaurant = snapshot.val();
      if (restaurant) {
        res.status(200).json(restaurant);
      } else {
        res.status(404).json({ message: 'Restaurant not found' });
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error);
      res.status(500).json({ message: 'Error fetching restaurant data', error: error.message });
    }
  }

  async getAllRestaurants(req, res) {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'restaurants'));
      const restaurants = snapshot.val();
      if (restaurants) {
        res.status(200).json(restaurants);
      } else {
        res.status(404).json({ message: 'No restaurants found' });
      }
    } catch (error) {
      console.error('Error fetching restaurants data:', error);
      res.status(500).json({ message: 'Error fetching restaurants data', error: error.message });
    }
  }
}

export default RestaurantController;
import { database, ref, get, child, query, orderByChild, equalTo } from '../config/firebaseConfig.js';

class MenuController {
  async getMenu(req, res) {
    const restaurantId = req.query.restaurantId;
    if (!restaurantId) {
      return res.status(400).json({ message: 'restaurantId query parameter is required' });
    }

    try {
      const dbRef = ref(database, 'menus');
      const menuQuery = query(dbRef, orderByChild('restaurantId'), equalTo(restaurantId));
      const snapshot = await get(menuQuery);
      const menu = snapshot.val();
      if (menu) {
        res.status(200).json(Object.values(menu));
      } else {
        res.status(404).json({ message: 'Menu not found' });
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
      res.status(500).json({ message: 'Error fetching menu data', error: error.message });
    }
  }
}

export default MenuController;

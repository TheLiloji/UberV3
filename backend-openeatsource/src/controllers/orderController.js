import { database, ref, set, push, get } from '../config/firebaseConfig.js';

class OrderController {
  async createOrder(req, res) {
    const userId = req.userId;
    const { items, address, paymentMethod, subtotal, deliveryFees, total, deliveryInstructions, restaurants } = req.body;

    if (!items || !address || !paymentMethod || !subtotal || !deliveryFees || !total || !restaurants) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const orderNumber = `ORD-${Date.now()}`;
    const formattedDate = new Date().toISOString();

    const newOrder = {
      orderNumber,
      date: formattedDate,
      items,
      address,
      paymentMethod,
      subtotal,
      deliveryFees,
      total,
      status: 'En préparation',
      deliveryInstructions,
      restaurants: restaurants.map(restaurant => ({
        name: restaurant.name,
        image: restaurant.image,
        subtotal: restaurant.subtotal,
        deliveryFee: restaurant.deliveryFee
      }))
    };

    try {
      const ordersRef = ref(database, 'orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, newOrder);

      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const user = userSnapshot.val();
        const orderIDs = user.orderIDs || [];
        orderIDs.push(newOrderRef.key);
        await set(userRef, { ...user, orderIDs });
      }

      res.status(201).json({ message: 'Order created successfully', orderId: newOrderRef.key });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Error creating order', error: error.message });
    }
  }

  async getUserOrders(req, res) {
    const userId = req.userId;

    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userSnapshot.val();
      const orders = [];
      for (const orderId of user.orderIDs || []) {
        const orderRef = ref(database, `orders/${orderId}`);
        const orderSnapshot = await get(orderRef);
        if (orderSnapshot.exists()) {
          orders.push({ id: orderId, ...orderSnapshot.val() });
        }
      }

      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ message: 'Error fetching user orders', error: error.message });
    }
  }
}

export default OrderController;

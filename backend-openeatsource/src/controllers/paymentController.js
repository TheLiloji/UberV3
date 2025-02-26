import { database, ref, get, set, push } from '../config/firebaseConfig.js';

class PaymentController {
  async addPaymentMethod(req, res) {
    const userId = req.userId;
    const { type, label, icon, isDefault } = req.body;
    if (!type || !label || !icon) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const newPaymentMethod = {
      type,
      label,
      icon,
      isDefault: isDefault || false,
    };

    try {
      const paymentMethodsRef = ref(database, 'paymentMethods');
      const newPaymentMethodRef = push(paymentMethodsRef);
      await set(newPaymentMethodRef, newPaymentMethod);

      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const user = userSnapshot.val();
        const paymentMethodIDs = user.paymentMethodIDs || [];
        paymentMethodIDs.push(newPaymentMethodRef.key);
        await set(userRef, { ...user, paymentMethodIDs });
      }

      res.status(201).json({ message: 'Payment method added successfully', paymentMethodId: newPaymentMethodRef.key });
      console.log('Payment method added successfully');
    } catch (error) {
      console.error('Error adding payment method:', error);
      res.status(500).json({ message: 'Error adding payment method', error: error.message });
    }
  }

  async getPaymentMethods(req, res) {
    const userId = req.userId;

    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userSnapshot.val();
      const paymentMethods = [];
      for (const paymentMethodId of user.paymentMethodIDs || []) {
        const paymentMethodRef = ref(database, `paymentMethods/${paymentMethodId}`);
        const paymentMethodSnapshot = await get(paymentMethodRef);
        if (paymentMethodSnapshot.exists()) {
          paymentMethods.push({ id: paymentMethodId, ...paymentMethodSnapshot.val() });
        }
      }

      res.status(200).json(paymentMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      res.status(500).json({ message: 'Error fetching payment methods', error: error.message });
    }
  }

  async deletePaymentMethod(req, res) {
    const userId = req.userId;
    const { paymentMethodId } = req.params;

    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userSnapshot.val();
      if (!user.paymentMethodIDs || !user.paymentMethodIDs.includes(paymentMethodId)) {
        return res.status(404).json({ message: 'Payment method not found' });
      }

      const paymentMethodRef = ref(database, `paymentMethods/${paymentMethodId}`);
      await set(paymentMethodRef, null);

      const updatedPaymentMethodIDs = user.paymentMethodIDs.filter(id => id !== paymentMethodId);
      await set(userRef, { ...user, paymentMethodIDs: updatedPaymentMethodIDs });

      res.status(200).json({ message: 'Payment method deleted successfully' });
    } catch (error) {
      console.error('Error deleting payment method:', error);
      res.status(500).json({ message: 'Error deleting payment method', error: error.message });
    }
  }

  async toggleDefaultPaymentMethod(req, res) {
    const userId = req.userId;
    const { paymentMethodId } = req.params;

    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userSnapshot.val();
      if (!user.paymentMethodIDs || !user.paymentMethodIDs.includes(paymentMethodId)) {
        return res.status(404).json({ message: 'Payment method not found' });
      }

      const paymentMethods = [];
      for (const id of user.paymentMethodIDs) {
        const paymentMethodRef = ref(database, `paymentMethods/${id}`);
        const paymentMethodSnapshot = await get(paymentMethodRef);
        if (paymentMethodSnapshot.exists()) {
          const paymentMethod = paymentMethodSnapshot.val();
          paymentMethod.isDefault = (id === paymentMethodId);
          await set(paymentMethodRef, paymentMethod);
          paymentMethods.push({ id, ...paymentMethod });
        }
      }

      res.status(200).json({ message: 'Default payment method updated successfully', paymentMethods });
    } catch (error) {
      console.error('Error toggling default payment method:', error);
      res.status(500).json({ message: 'Error toggling default payment method', error: error.message });
    }
  }
}

export default PaymentController;

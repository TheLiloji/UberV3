import { database, ref, get, set, push } from '../config/firebaseConfig.js';

class AddressController {
  async getAddresses(req, res) {
    const userId = req.userId;
    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userSnapshot.val();
      const addresses = [];
      for (const addressId of user.addressIDs || []) {
        const addressRef = ref(database, `addresses/${addressId}`);
        const addressSnapshot = await get(addressRef);
        if (addressSnapshot.exists()) {
          addresses.push({ id: addressId, ...addressSnapshot.val() });
        }
      }

      res.status(200).json(addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
  }

  async getAddress(req, res) {
    const userId = req.userId;
    const { addressId } = req.params;
    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userSnapshot.val();
      if (!user.addressIDs || !user.addressIDs.includes(addressId)) {
        return res.status(404).json({ message: 'Address not found' });
      }

      const addressRef = ref(database, `addresses/${addressId}`);
      const addressSnapshot = await get(addressRef);
      if (!addressSnapshot.exists()) {
        return res.status(404).json({ message: 'Address not found' });
      }

      res.status(200).json({ id: addressId, ...addressSnapshot.val() });
    } catch (error) {
      console.error('Error fetching address:', error);
      res.status(500).json({ message: 'Error fetching address', error: error.message });
    }
  }

  async addAddress(req, res) {
    const userId = req.userId;
    const { label, address, deliveryInstructions, deliveryMethod, deliveryOption, icon, coordinates } = req.body;
    if (!label || !address || !deliveryMethod || !icon || !coordinates || !coordinates.latitude || !coordinates.longitude) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const newAddress = {
      label,
      address,
      deliveryInstructions,
      deliveryMethod,
      deliveryOption,
      icon,
      coordinates,
    };

    try {
      const addressesRef = ref(database, 'addresses');
      const newAddressRef = push(addressesRef);
      await set(newAddressRef, newAddress);

      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (userSnapshot.exists()) {
        const user = userSnapshot.val();
        const addressIDs = user.addressIDs || [];
        addressIDs.push(newAddressRef.key);
        await set(userRef, { ...user, addressIDs });
      }

      res.status(201).json({ message: 'Address added successfully', addressId: newAddressRef.key });
    } catch (error) {
      console.error('Error adding address:', error);
      res.status(500).json({ message: 'Error adding address', error: error.message });
    }
  }

  async deleteAddress(req, res) {
    const userId = req.userId;
    const { addressId } = req.params;

    try {
      const userRef = ref(database, `users/${userId}`);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = userSnapshot.val();
      if (!user.addressIDs || !user.addressIDs.includes(addressId)) {
        return res.status(404).json({ message: 'Address not found' });
      }

      const addressRef = ref(database, `addresses/${addressId}`);
      await set(addressRef, null);

      const updatedAddressIDs = user.addressIDs.filter(id => id !== addressId);
      await set(userRef, { ...user, addressIDs: updatedAddressIDs });

      res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
  }
}

export default AddressController;

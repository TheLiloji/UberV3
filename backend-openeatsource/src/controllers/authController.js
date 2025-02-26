import { database, ref, get, set, child } from '../config/firebaseConfig.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret

class AuthController {
  async register(req, res) {
    const { email, password, firstName, lastName, avatarUrl} = req.body;
    if (!email || !password || !firstName || !lastName || !avatarUrl) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const sanitizedEmail = email.replace(/\./g, '_');
      const userRef = ref(database, `users/${sanitizedEmail}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await set(userRef, {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        avatarUrl,
      });

      console.log(`User registered with email: ${email}`);
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const sanitizedEmail = email.replace(/\./g, '_');
      const userRef = ref(database, `users/${sanitizedEmail}`);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        console.log(`User with email ${email} not found`);
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const user = snapshot.val();
      console.log(password);
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log(`Password for email ${email} is invalid`);
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: sanitizedEmail }, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
  }

  async updateAccount(req, res) {
    const userId = req.userId;
    const { firstName, lastName, avatarUrl } = req.body;

    if (!firstName || !lastName || !avatarUrl) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        return res.status(404).json({ message: 'User not found' });
      }

      await set(userRef, {
        ...snapshot.val(),
        firstName,
        lastName,
        avatarUrl,
      });

      res.status(200).json({ message: 'Account updated successfully' });
    } catch (error) {
      console.error('Error updating account:', error);
      res.status(500).json({ message: 'Error updating account', error: error.message });
    }
  }

  async getUserProfile(req, res) {
    const userId = req.userId;

    try {
      const userRef = ref(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = snapshot.val();
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  }
}

export default AuthController;

import axiosInstance from '@/api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Restaurant {
  id: number;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  tags: string[];
  category: string;
  priceCategory: string;
  description: string;
  address: string;
  isOpen: boolean;
  minimumOrder: number;
  menu: MenuItem[];
}

export const MENU_CATEGORIES = [
  'Tout',
  'Entrées',
  'Plats',
  'Desserts',
  'Boissons',
  'Specialités',
];

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  options?: {
    name: string;
    choices: {
      id: number;
      name: string;
      price: number;
    }[];
  }[];
}

let POPULAR_RESTAURANTS: Restaurant[] = [];

const fetchRestaurants = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axiosInstance.get('/api/restaurants', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    POPULAR_RESTAURANTS = response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }
};

fetchRestaurants();

export { POPULAR_RESTAURANTS };
import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import { POPULAR_RESTAURANTS } from '@/constants/data';

export default function RestaurantLayout() {
  const { id } = useGlobalSearchParams();
  const router = useRouter();
  
  const restaurant = POPULAR_RESTAURANTS.find(r => r.id === id);
  const restaurantName = restaurant?.name || 'Restaurant';

  const CartButton = () => (
    <TouchableOpacity 
      onPress={() => router.push('/cart')}
      style={{ 
        marginRight: 16,
        padding: 4,
      }}
    >
      <Ionicons name="cart-outline" size={24} color="white" />
    </TouchableOpacity>
  );

  return (
    <Stack>
      <Stack.Screen 
        name="[id]"
        options={{
          title: restaurantName,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',
          headerRight: () => <CartButton />,
        }}
      />
    </Stack>
  );
} 
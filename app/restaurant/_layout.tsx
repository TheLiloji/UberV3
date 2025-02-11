import { Stack, useGlobalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { POPULAR_RESTAURANTS } from '@/constants/data';

export default function RestaurantLayout() {
  const { id } = useGlobalSearchParams();
  const router = useRouter();
  
  const restaurant = POPULAR_RESTAURANTS.find(r => r.id === id);
  const restaurantName = restaurant?.name || 'Restaurant';

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
        }}
      />
    </Stack>
  );
} 
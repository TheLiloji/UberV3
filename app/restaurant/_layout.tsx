import { Stack, useGlobalSearchParams, useRouter } from 'expo-router';

import { POPULAR_RESTAURANTS } from '@/constants/data';

export default function RestaurantLayout() {
  const { id } = useGlobalSearchParams();
  
  const restaurant = POPULAR_RESTAURANTS.find(r => r.id === Number(id));
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
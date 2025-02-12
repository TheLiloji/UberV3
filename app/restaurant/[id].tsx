import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { POPULAR_RESTAURANTS } from '@/constants/data';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  options?: { name: string; choices: { id: string; name: string; price: number }[] }[];
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Entrées',
    category: 'starters',
    description: 'Nos entrées signature',
    price: 0,
  },
  {
    id: '2',
    name: 'Salade César',
    category: 'starters',
    description: 'Laitue romaine, croûtons, parmesan, sauce césar maison',
    price: 9.90,
    image: 'https://picsum.photos/200/200?random=7',
  },
  {
    id: '3',
    name: 'Plat Principal',
    category: 'main',
    description: 'Nos spécialités',
    price: 0,
  },
  {
    id: '4',
    name: 'Steak Frites',
    category: 'main',
    description: 'Steak de bœuf, frites maison, sauce au poivre',
    price: 18.90,
    image: 'https://picsum.photos/200/200?random=8',
  },
];

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const restaurant = POPULAR_RESTAURANTS.find(r => r.id === Number(id));

  if (!restaurant) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Restaurant non trouvé</ThemedText>
      </ThemedView>
    );
  }

  useEffect(() => {
    router.setParams({ title: restaurant.name });
  }, [restaurant]);

  const filteredMenu = selectedCategory === 'all' 
    ? restaurant.menu 
    : restaurant.menu.filter(item => item.category === selectedCategory);

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {/* Restaurant Image */}
        <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />

        {/* Restaurant Info */}
        <ThemedView style={styles.restaurantInfo}>
          <ThemedText type="title">{restaurant.name}</ThemedText>
          <ThemedText style={styles.restaurantCategory}>
            {restaurant.category} • {restaurant.priceCategory}
          </ThemedText>
          <ThemedText>
            ⭐ {restaurant.rating} • {restaurant.deliveryTime} min • Livraison {restaurant.deliveryFee}€
          </ThemedText>
        </ThemedView>

        {/* Menu Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
        >
          {['all', ...new Set(restaurant.menu.map(item => item.category))].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory,
              ]}
            >
              <ThemedText 
                style={[
                  selectedCategory === category && { color: 'white' }
                ]}
              >
                {category}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Items */}
        <ThemedView style={styles.menuContainer}>
          {filteredMenu.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <ThemedView style={styles.menuItemContent}>
                <ThemedView style={styles.menuItemInfo}>
                  <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
                  <ThemedText style={styles.menuItemDescription}>
                    {item.description}
                  </ThemedText>
                  {item.price > 0 && (
                    <ThemedText style={styles.menuItemPrice}>{item.price.toFixed(2)}€</ThemedText>
                  )}
                  {item.options && (
                    <ThemedText style={styles.menuItemOptions}>
                      Options disponibles
                    </ThemedText>
                  )}
                </ThemedView>
                {item.image && (
                  <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                )}
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  restaurantInfo: {
    padding: 16,
    gap: 8,
  },
  restaurantCategory: {
    fontSize: 14,
    color: '#666',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedCategory: {
    backgroundColor: '#000',
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    marginBottom: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  menuItemDescription: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  menuItemPrice: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  menuItemOptions: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
}); 
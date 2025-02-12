import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { POPULAR_RESTAURANTS } from '@/constants/data';
import { theme } from '@/constants/theme';
import { useCart } from '@/contexts/CartContext';

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
  const { addToCart } = useCart();

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
      <ScrollView 
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* En-tête avec image et bouton retour */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <ThemedView style={styles.restaurantInfo}>
          <ThemedText type="title" style={styles.restaurantName}>
            {restaurant.name}
          </ThemedText>
          <ThemedView style={styles.ratingContainer}>
            <ThemedText style={styles.rating}>⭐ {restaurant.rating}</ThemedText>
            <ThemedText style={styles.dot}>•</ThemedText>
            <ThemedText style={styles.deliveryTime}>{restaurant.deliveryTime} min</ThemedText>
            <ThemedText style={styles.dot}>•</ThemedText>
            <ThemedText style={styles.deliveryFee}>Livraison {restaurant.deliveryFee}€</ThemedText>
          </ThemedView>
          <ThemedText style={styles.restaurantCategory}>
            {restaurant.category} • {restaurant.priceCategory}
          </ThemedText>
        </ThemedView>

        {/* Menu Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
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
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}
              >
                {category === 'all' ? 'Tout' : category}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Items */}
        <ThemedView style={styles.menuContainer}>
          {filteredMenu.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.menuItem,
                item.price === 0 && styles.menuSection
              ]}
            >
              {item.price === 0 ? (
                <ThemedText 
                  type="subtitle"
                  style={styles.menuSectionTitle}
                >
                  {item.name}
                </ThemedText>
              ) : (
                <ThemedView style={styles.menuItemContent}>
                  <ThemedView style={styles.menuItemInfo}>
                    <ThemedText type="defaultSemiBold">
                      {item.name}
                    </ThemedText>
                    {item.description && (
                      <ThemedText style={styles.menuItemDescription}>
                        {item.description}
                      </ThemedText>
                    )}
                    <View style={styles.menuItemBottom}>
                      <ThemedText style={styles.menuItemPrice}>
                        {item.price.toFixed(2)}€
                      </ThemedText>
                      <TouchableOpacity 
                        style={styles.addButton}
                        onPress={() => addToCart({
                          id: item.id,
                          restaurantId: Number(id),
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        })}
                      >
                        <Ionicons name="add" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                  </ThemedView>
                  {item.image && (
                    <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                  )}
                </ThemedView>
              )}
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
  headerContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  restaurantName: {
    fontSize: 24,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
  },
  dot: {
    marginHorizontal: 8,
    color: theme.colors.textSecondary,
  },
  deliveryTime: {
    fontSize: 16,
  },
  deliveryFee: {
    fontSize: 16,
  },
  restaurantCategory: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  categoriesContainer: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoriesContent: {
    padding: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  selectedCategoryText: {
    color: 'white',
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    marginBottom: 16,
  },
  menuSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  menuSectionTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 16,
  },
  menuItemDescription: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    color: theme.colors.primary,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  menuItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
}); 
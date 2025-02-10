import { Image, StyleSheet, ScrollView, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { POPULAR_RESTAURANTS } from '@/constants/data';

const CATEGORIES = [
  {
    id: '1',
    name: 'Restaurants',
    icon: '🍽️',
  },
  {
    id: '2',
    name: 'Épicerie',
    icon: '🛒',
  },
  {
    id: '3',
    name: 'Offres',
    icon: '🏷️',
  },
  {
    id: '4',
    name: 'Alcool',
    icon: '🍷',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* En-tête avec barre de recherche */}
      <ThemedView style={styles.header}>
        <ThemedView style={styles.searchBar}>
          <Ionicons name="search" size={24} color="#666" />
          <TextInput 
            placeholder="Rechercher un restaurant ou un plat"
            style={styles.searchInput}
          />
        </ThemedView>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section des catégories */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Catégories</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity key={category.id}>
                <ThemedView style={styles.categoryCard}>
                  <ThemedText style={styles.categoryIcon}>{category.icon}</ThemedText>
                  <ThemedText>{category.name}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Section des restaurants populaires */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Restaurants populaires</ThemedText>
          {POPULAR_RESTAURANTS.map((restaurant) => (
            <TouchableOpacity 
              key={restaurant.id} 
              onPress={() => router.push(`/restaurant/${restaurant.id}`)}
            >
              <ThemedView style={styles.restaurantCard}>
                <Image 
                  source={{ uri: restaurant.image }}
                  style={styles.restaurantImage}
                />
                <ThemedView style={styles.restaurantInfo}>
                  <ThemedText type="defaultSemiBold">{restaurant.name}</ThemedText>
                  <ThemedText style={styles.restaurantCategory}>
                    {restaurant.category} • {restaurant.priceCategory}
                  </ThemedText>
                  <ThemedText>
                    ⭐ {restaurant.rating} • {restaurant.deliveryTime} min • {restaurant.deliveryFee}€
                  </ThemedText>
                </ThemedView>
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
  header: {
    padding: 16,
    paddingTop: 60,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    gap: 16,
  },
  categoriesScroll: {
    marginTop: 8,
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 100,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  restaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: 100,
    height: 100,
  },
  restaurantInfo: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  restaurantCategory: {
    color: '#666',
    fontSize: 14,
  },
});
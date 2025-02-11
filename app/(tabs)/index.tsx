import { Image, StyleSheet, ScrollView, TextInput, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { Colors } from '@/constants/Colors';

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
  const { selectedAddress } = useLocalSearchParams();
  const [address, setAddress] = useState(selectedAddress || 'Votre position actuelle');
  
  useEffect(() => {
    if (selectedAddress) {
      setAddress(selectedAddress.toString());
    }
  }, [selectedAddress]);

  const handleLocationPress = () => {
    router.push('/address-selection');
  };

  return (
    <ScrollView style={{
      flex: 1,
      backgroundColor: Colors.background,
    }}>
      {/* En-tête avec localisation et barre de recherche */}
      <ThemedView style={styles.header}>
        {/* Barre de localisation */}
        <TouchableOpacity 
          style={styles.locationBar}
          onPress={handleLocationPress}
        >
          <ThemedView style={styles.locationContent}>
            <Ionicons name="location-outline" size={24} color="black" />
            <ThemedView style={styles.locationInfo}>
              <ThemedText style={styles.locationLabel}>Livrer à</ThemedText>
              <ThemedText style={styles.locationAddress} numberOfLines={1}>
                {address}
              </ThemedText>
            </ThemedView>
            <Ionicons name="chevron-down" size={24} color="black" />
          </ThemedView>
        </TouchableOpacity>

        {/* Barre de recherche */}
        <ThemedView style={styles.searchBar}>
          <Ionicons name="search" size={24} color="#666" />
          <TextInput 
            placeholder="Rechercher un restaurant ou un plat"
            style={styles.searchInput}
          />
        </ThemedView>
      </ThemedView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={{
          backgroundColor: Colors.categoryBackground,
          padding: 16,
          marginVertical: 8,
          borderRadius: 8,
        }}>
          <Text style={{
            color: Colors.text,
            fontSize: 16,
            fontWeight: '600',
          }}>
            Catégories
          </Text>
        </View>

        {/* Section des catégories */}
        <ThemedView style={styles.section}>
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

        {/* Restaurants */}
        <View style={{
          backgroundColor: Colors.restaurantBackground,
          padding: 16,
          marginVertical: 8,
          borderRadius: 8,
        }}>
          <Text style={{
            color: Colors.text,
            fontSize: 16,
            fontWeight: '600',
          }}>
            Restaurants
          </Text>
          <Text style={{
            color: Colors.textGray,
            fontSize: 14,
            marginTop: 4,
          }}>
            Description du restaurant
          </Text>
        </View>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 16,
  },
  locationBar: {
    backgroundColor: '#ffe4b9',
    borderRadius: 8,
    padding: 12,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: '#9b9c9c',
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d2f2f',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2d2f2f',
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
    backgroundColor: '#ffe4b9',
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
    backgroundColor: '#ffffff',
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
    color: '#9b9c9c',
    fontSize: 14,
  },
});
import { Image, StyleSheet, ScrollView, TextInput, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { POPULAR_RESTAURANTS } from '@/constants/data';

const CATEGORIES = [
  {
    id: '0',
    name: 'Tout',
    type: 'button',
    tag: 'all',
  },
  {
    id: '1',
    name: 'Fast Food',
    image: 'https://i.imgur.com/G0f2vwh.png',
    type: 'category',
    tag: 'fastfood',
  },
  {
    id: '2',
    name: 'Asiatique',
    image: 'https://i.imgur.com/xvmt8Cf.png',
    type: 'category',
    tag: 'asian',
  },
  {
    id: '3',
    name: 'Italien',
    image: 'https://i.imgur.com/kg29fR4.png',
    type: 'category',
    tag: 'italian',
  },
  {
    id: '4',
    name: 'Français',
    image: 'https://i.imgur.com/G88jzLo.png',
    type: 'category',
    tag: 'french',
  },
  {
    id: '5',
    name: 'Oriental',
    image: 'https://i.imgur.com/9xhdKSE.png',
    type: 'category',
    tag: 'oriental',
  },
  {
    id: '6',
    name: 'Indien',
    image: 'https://i.imgur.com/bJiGHar.png',
    type: 'category',
    tag: 'indian',
  },
  {
    id: '7',
    name: 'Vegan',
    image: 'https://i.imgur.com/SCxGd38.png',
    type: 'category',
    tag: 'vegan',
  },
  {
    id: '8',
    name: 'Healthy',
    image: 'https://i.imgur.com/muGBTS9.png',
    type: 'category',
    tag: 'healthy',
  },
  {
    id: '9',
    name: 'Boisson',
    image: 'https://i.imgur.com/M7VkLCv.png',
    type: 'category',
    tag: 'drinks',
  },
  {
    id: '10',
    name: 'Dessert',
    image: 'https://i.imgur.com/sSQfn7V.png',
    type: 'category',
    tag: 'dessert',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { selectedAddress } = useLocalSearchParams();
  const [address, setAddress] = useState(selectedAddress || 'Sélectionnez votre position actuelle');
  
  useEffect(() => {
    if (selectedAddress) {
      setAddress(selectedAddress.toString());
    }
  }, [selectedAddress]);

  const handleLocationPress = () => {
    router.push('/address-selection');
  };

  // Tri et filtrage des restaurants
  const topRestaurants = POPULAR_RESTAURANTS
    .sort((a, b) => b.rating - a.rating) // Tri par note décroissante
    .slice(0, 8); // Garde uniquement les 8 premiers

  return (
    <ThemedView style={styles.container}>
      {/* Barre de localisation fixe */}
      <TouchableOpacity 
        style={styles.fixedLocationBar}
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

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* En-tête avec image et barre de recherche */}
        <ThemedView style={styles.scrollHeader}>
          <ImageBackground 
            source={{ uri: 'https://i.imgur.com/dgyZrhd.png' }}
            style={styles.headerImage}
            resizeMode="cover"
          >
            <ThemedText style={styles.appTitle}>OpenEatSource</ThemedText>
          </ImageBackground>

          {/* Barre de recherche */}
          <ThemedView style={styles.searchBar}>
            <Ionicons name="search" size={24} color="#666" />
            <TextInput 
              placeholder="Rechercher un restaurant ou un plat"
              style={styles.searchInput}
            />
          </ThemedView>
        </ThemedView>

        {/* Section des catégories */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Catégories</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity key={category.id}>
                {category.type === 'button' ? (
                  <ThemedView style={styles.allCategoryButton}>
                    <ThemedText style={styles.allCategoryText}>{category.name}</ThemedText>
                  </ThemedView>
                ) : (
                  <ThemedView style={styles.categoryCard}>
                    <Image 
                      source={{ uri: category.image }} 
                      style={styles.categoryImage}
                    />
                    <ThemedText style={styles.categoryText}>{category.name}</ThemedText>
                  </ThemedView>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Section des restaurants populaires */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Les 8 meilleurs restaurants</ThemedText>
          <ThemedView style={styles.restaurantsGrid}>
            {topRestaurants.map((restaurant) => (
              <TouchableOpacity 
                key={restaurant.id} 
                style={styles.restaurantWrapper}
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
              >
                <ThemedView style={styles.restaurantCard}>
                  <Image 
                    source={{ uri: restaurant.image }}
                    style={styles.restaurantImage}
                  />
                  <ThemedView style={styles.restaurantInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.restaurantName}>
                      {restaurant.name}
                    </ThemedText>
                    <ThemedView style={styles.restaurantDetails}>
                      <ThemedText style={styles.restaurantRating}>
                        ⭐ {restaurant.rating}
                      </ThemedText>
                      <ThemedText style={styles.restaurantCategory}>
                        {restaurant.category}
                      </ThemedText>
                    </ThemedView>
                    <ThemedText style={styles.restaurantDelivery}>
                      {restaurant.deliveryTime} min
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixedLocationBar: {
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  scrollHeader: {
    padding: 16,
    gap: 16,
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
    color: '#666',
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#f5b44d',
    marginVertical: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 4,
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
    backgroundColor: '#ffe5b9',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 100,
  },
  categoryImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  categoryText: {
    color: '#2d2f2f',
    fontSize: 14,
  },
  restaurantsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  restaurantWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  restaurantCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  restaurantDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  restaurantRating: {
    fontSize: 12,
    marginRight: 8,
  },
  restaurantCategory: {
    fontSize: 12,
    color: '#666',
  },
  restaurantDelivery: {
    fontSize: 12,
    color: '#666',
  },
  allCategoryButton: {
    alignItems: 'center',
    backgroundColor: '#ffe5b9',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    width: 100,
    height: 100,
    justifyContent: 'center',
  },
  allCategoryText: {
    color: '#2d2f2f',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#ffe5b9',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  headerImage: {
    width: '100vw',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: -16,
    marginTop: -16,
    marginBottom: -16,
    alignSelf: 'stretch',
    left: 0,
    right: 0,
    position: 'relative',
  },
  appTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 48,
  },
});
import { Image, StyleSheet, ScrollView, TextInput, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { AnimatedCategoryTitle } from '@/components/AnimatedCategoryTitle';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { POPULAR_RESTAURANTS } from '@/constants/data';
import { theme } from '@/constants/theme';
import { USER_DATA } from '@/constants/user';

const CATEGORIES = [
  {
    id: '0',
    name: 'Tout',
    type: 'button',
    tag: 'all',
    bannerImage: 'https://i.imgur.com/2fvxSOB.jpeg',
  },
  {
    id: '1',
    name: 'Fast Food',
    image: 'https://i.imgur.com/G0f2vwh.png',
    type: 'category',
    tag: 'fastfood',
    bannerImage: 'https://i.imgur.com/oagYSS4.png',
  },
  {
    id: '2',
    name: 'Asiatique',
    image: 'https://i.imgur.com/xvmt8Cf.png',
    type: 'category',
    tag: 'asian',
    bannerImage: 'https://i.imgur.com/bYuIojY.jpeg',
  },
  {
    id: '3',
    name: 'Italien',
    image: 'https://i.imgur.com/kg29fR4.png',
    type: 'category',
    tag: 'italian',
    bannerImage: 'https://i.imgur.com/YqUAGnt.jpeg',
  },
  {
    id: '4',
    name: 'Français',
    image: 'https://i.imgur.com/G88jzLo.png',
    type: 'category',
    tag: 'french',
    bannerImage: 'https://i.imgur.com/c961zWQ.jpeg',
  },
  {
    id: '5',
    name: 'Oriental',
    image: 'https://i.imgur.com/9xhdKSE.png',
    type: 'category',
    tag: 'oriental',
    bannerImage: 'https://i.imgur.com/qTCnRcS.png',
  },
  {
    id: '6',
    name: 'Indien',
    image: 'https://i.imgur.com/bJiGHar.png',
    type: 'category',
    tag: 'indian',
    bannerImage: 'https://i.imgur.com/DwxWqpK.jpeg',
  },
  {
    id: '7',
    name: 'Vegan',
    image: 'https://i.imgur.com/SCxGd38.png',
    type: 'category',
    tag: 'vegan',
    bannerImage: 'https://i.imgur.com/rf5TwOE.jpeg',
  },
  {
    id: '8',
    name: 'Healthy',
    image: 'https://i.imgur.com/muGBTS9.png',
    type: 'category',
    tag: 'healthy',
    bannerImage: 'https://i.imgur.com/XtpesqP.jpeg',
  },
  {
    id: '9',
    name: 'Boisson',
    image: 'https://i.imgur.com/M7VkLCv.png',
    type: 'category',
    tag: 'drinks',
    bannerImage: 'https://i.imgur.com/0X77IWP.jpeg',
  },
  {
    id: '10',
    name: 'Dessert',
    image: 'https://i.imgur.com/sSQfn7V.png',
    type: 'category',
    tag: 'dessert',
    bannerImage: 'https://i.imgur.com/kVqRmc8.jpeg',
  },
  {
    id: '11',
    name: 'Petit Prix',
    image: 'https://i.imgur.com/N7Hx5Cy.png',
    type: 'category',
    tag: 'lowbudget',
    bannerImage: 'https://i.imgur.com/CwSnu3q.jpeg',
  },
];

const getAllMenuItems = (restaurants: typeof POPULAR_RESTAURANTS) => {
  return restaurants.flatMap(restaurant => 
    restaurant.menu
      .filter(item => item.price > 0) // On ne prend que les plats avec un prix
      .map(item => ({
        ...item,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      }))
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { selectedAddress } = useLocalSearchParams();
  const [address, setAddress] = useState(selectedAddress || 'Sélectionnez votre position actuelle');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    restaurants: typeof POPULAR_RESTAURANTS,
    menuItems: ReturnType<typeof getAllMenuItems>
  }>({ restaurants: [], menuItems: [] });
  
  useEffect(() => {
    if (selectedAddress) {
      setAddress(selectedAddress.toString());
    }
  }, [selectedAddress]);

  const handleLocationPress = () => {
    router.push('/address-selection');
  };

  const handleCategoryPress = (categoryTag: string) => {
    if (selectedCategory === categoryTag) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryTag);
    }
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return 'Tout';
    const category = CATEGORIES.find(cat => cat.tag === selectedCategory);
    return category ? category.name : 'Tout';
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setIsSearching(!!text);

    if (text) {
      const query = text.toLowerCase();
      
      // Filtrer les restaurants en fonction de la catégorie sélectionnée
      let filteredRestaurants = POPULAR_RESTAURANTS;
      if (selectedCategory && selectedCategory !== 'all') {
        filteredRestaurants = POPULAR_RESTAURANTS.filter(
          restaurant => restaurant.tags.includes(selectedCategory)
        );
      }

      // Recherche dans les restaurants filtrés
      const matchingRestaurants = filteredRestaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.category.toLowerCase().includes(query)
      );

      // Recherche dans les plats des restaurants filtrés
      const menuItems = getAllMenuItems(filteredRestaurants).filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );

      setSearchResults({
        restaurants: matchingRestaurants,
        menuItems: menuItems,
      });
    } else {
      setSearchResults({ restaurants: [], menuItems: [] });
    }
  };

  const filteredRestaurants = POPULAR_RESTAURANTS
    .filter(restaurant => {
      if (selectedCategory === null) {
        return true;
      }
      if (selectedCategory === 'all') {
        return true;
      }
      if (selectedCategory === 'lowbudget') {
        return restaurant.priceCategory === '€';
      }
      return restaurant.tags.includes(selectedCategory);
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, selectedCategory === null ? 8 : undefined);

  return (
    <ThemedView style={styles.container}>
      {/* Barre de localisation fixe */}
      <ThemedView style={styles.topBar}>
        <TouchableOpacity 
          style={styles.fixedLocationBar}
          onPress={handleLocationPress}
        >
          <ThemedView style={styles.locationContent}>
            <ThemedView style={styles.locationIconContainer}>
              <Image 
                source={{ uri: 'https://imgur.com/3K9Mi7p.png' }}
                style={styles.locationIcon}
              />
            </ThemedView>
            <ThemedView style={styles.locationInfo}>
              <ThemedText style={styles.locationLabel}>Livrer à</ThemedText>
              <ThemedText style={styles.locationAddress} numberOfLines={1}>
                {address}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/account')}
        >
          <Image 
            source={{ uri: USER_DATA.avatar }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
        {/* En-tête avec image et barre de recherche */}
        <ThemedView style={styles.scrollHeader}>
          {selectedCategory ? (
            <ImageBackground
              source={{ uri: CATEGORIES.find(cat => cat.tag === selectedCategory)?.bannerImage }}
              style={styles.categoryHeaderImage}
              resizeMode="cover"
            >
              <View style={styles.categoryHeaderOverlay}>
                <AnimatedCategoryTitle 
                  title={CATEGORIES.find(cat => cat.tag === selectedCategory)?.name || ''} 
                />
              </View>
            </ImageBackground>
          ) : (
            <ImageBackground
              source={{ uri: 'https://i.imgur.com/9H5MylK.png' }}
              style={styles.categoryHeaderImage}
              resizeMode="cover"
            >
              <View style={styles.categoryHeaderOverlay}>
                <View style={styles.mainTitleContainer}>
                  <View style={styles.titleWrapper}>
                    <ThemedText style={styles.mainTitleText}>Open Eat</ThemedText>
                    <ThemedText style={styles.sourceText}>SOURCE</ThemedText>
                  </View>
                  <View style={styles.orangeLine} />
                </View>
              </View>
            </ImageBackground>
          )}
          <ThemedView style={styles.searchBarCategory}>
          <Ionicons name="search" size={24} color="#666" />
          <TextInput 
              placeholder={`Rechercher dans ${getSelectedCategoryName()}`}
            style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery ? (
              <TouchableOpacity 
                onPress={() => {
                  setSearchQuery('');
                  setIsSearching(false);
                }}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            ) : null}
        </ThemedView>
      </ThemedView>

        {/* Section des catégories */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Catégories</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity 
                key={category.id}
                onPress={() => handleCategoryPress(category.tag)}
              >
                {category.type === 'button' ? (
                  <ThemedView style={[
                    styles.allCategoryButton,
                    selectedCategory === category.tag && styles.selectedAllCategoryButton
                  ]}>
                    <ThemedText style={[
                      styles.allCategoryText,
                      selectedCategory === category.tag && styles.selectedAllCategoryText
                    ]}>{category.name}</ThemedText>
                  </ThemedView>
                ) : (
                  <ThemedView style={[
                    styles.categoryCard,
                    selectedCategory === category.tag && styles.selectedCategoryCard
                  ]}>
                    <Image 
                      source={{ uri: category.image }} 
                      style={[
                        styles.categoryImage,
                        selectedCategory === category.tag && styles.selectedCategoryImage
                      ]}
                    />
                    <ThemedText style={[
                      styles.categoryText,
                      selectedCategory === category.tag && styles.selectedCategoryText
                    ]}>{category.name}</ThemedText>
              </ThemedView>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Section des restaurants */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">
            {selectedCategory === null 
              ? 'Les 8 meilleurs restaurants'
              : selectedCategory === 'all'
                ? 'Tous les restaurants'
                : `Restaurants ${CATEGORIES.find(cat => cat.tag === selectedCategory)?.name || ''}`}
          </ThemedText>
          <ThemedView style={styles.restaurantsGrid}>
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((restaurant) => (
                <TouchableOpacity 
                  key={restaurant.id} 
                  style={styles.restaurantWrapper}
                  onPress={() => router.push(`/restaurant/${restaurant.id}`)}
                >
                  <ThemedView style={styles.restaurantCard}>
                    <View style={styles.imageContainer}>
              <Image 
                        source={{ uri: restaurant.image }}
                style={styles.restaurantImage}
              />
                      <View style={styles.ratingBadge}>
                        <ThemedText style={styles.ratingText}>
                          ★ {restaurant.rating}
                        </ThemedText>
                      </View>
                    </View>
              <ThemedView style={styles.restaurantInfo}>
                      <ThemedText type="defaultSemiBold" style={styles.restaurantName}>
                        {restaurant.name}
                      </ThemedText>
                      <ThemedView style={styles.restaurantDetails}>
                        <ThemedText style={styles.restaurantDelivery}>
                          {restaurant.deliveryTime} min
                        </ThemedText>
                        <ThemedText style={styles.restaurantPrice}>
                          {restaurant.priceCategory}
                        </ThemedText>
                      </ThemedView>
                      <ThemedText style={styles.restaurantCategory}>
                        {restaurant.category}
                      </ThemedText>
              </ThemedView>
            </ThemedView>
                </TouchableOpacity>
              ))
            ) : (
              <ThemedText style={styles.noRestaurantsText}>
                Aucun restaurant trouvé dans cette catégorie
              </ThemedText>
            )}
          </ThemedView>
        </ThemedView>

        {/* Liste déroulante des résultats de recherche */}
        {isSearching && (
          <View style={styles.searchResults}>
            <ScrollView 
              style={styles.searchResultsScroll}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              indicatorStyle="black"
            >
              {searchResults.restaurants.length > 0 && (
                <View>
                  <ThemedText style={styles.searchResultsSection}>Restaurants</ThemedText>
                  {searchResults.restaurants.map((restaurant) => (
                    <TouchableOpacity
                      key={`restaurant-${restaurant.id}`}
                      style={styles.searchResultItem}
                      onPress={() => {
                        router.push(`/restaurant/${restaurant.id}`);
                        setSearchQuery('');
                        setIsSearching(false);
                      }}
                    >
                      <Image 
                        source={{ uri: restaurant.image }} 
                        style={styles.searchResultImage}
                      />
                      <View style={styles.searchResultInfo}>
                        <ThemedText style={styles.searchResultName}>
                          {restaurant.name}
                        </ThemedText>
                        <ThemedText style={styles.searchResultDetails}>
                          {restaurant.category} • {restaurant.deliveryTime} min • {restaurant.priceCategory}
                        </ThemedText>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {searchResults.menuItems.length > 0 && (
                <View>
                  <ThemedText style={styles.searchResultsSection}>Plats</ThemedText>
                  {searchResults.menuItems.map((item) => (
                    <TouchableOpacity
                      key={`menu-${item.restaurantId}-${item.id}`}
                      style={styles.searchResultItem}
                      onPress={() => {
                        router.push(`/restaurant/${item.restaurantId}`);
                        setSearchQuery('');
                        setIsSearching(false);
                      }}
                    >
                      {item.image && (
                        <Image 
                          source={{ uri: item.image }} 
                          style={styles.searchResultImage}
                        />
                      )}
                      <View style={styles.searchResultInfo}>
                        <ThemedText style={styles.searchResultName}>
                          {item.name}
                        </ThemedText>
                        <ThemedText style={styles.searchResultDetails}>
                          {item.price.toFixed(2)}€ • {item.restaurantName}
                        </ThemedText>
                        {item.description && (
                          <ThemedText style={styles.searchResultDescription} numberOfLines={2}>
                            {item.description}
                          </ThemedText>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
  },
  fixedLocationBar: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flex: 1,
  },
  scrollHeader: {
    width: '100%',
    marginBottom: theme.spacing.md,
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
  searchBarCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginTop: -25,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
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
    height: 100,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategoryCard: {
    borderColor: theme.colors.primary,
    backgroundColor: '#ffe5b9',
  },
  categoryImage: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  selectedCategoryImage: {
    opacity: 0.8,
  },
  categoryText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    color: '#2d2f2f',
  },
  selectedCategoryText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
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
  imageContainer: {
    position: 'relative',
  },
  restaurantImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ffe5b9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
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
    marginTop: 8,
    gap: 12,
  },
  restaurantDelivery: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  restaurantPrice: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  restaurantCategory: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
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
    borderWidth: 2,
    borderColor: 'transparent',
  },
  allCategoryText: {
    color: '#2d2f2f',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedAllCategoryButton: {
    borderColor: theme.colors.primary,
    backgroundColor: '#ffe5b9',
  },
  selectedAllCategoryText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
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
    zIndex: 1,
  },
  selectedCategoryButton: {
    backgroundColor: theme.colors.primary,
  },
  searchBarContainer: {
    padding: 16,
    paddingTop: 16,
  },
  noRestaurantsText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    padding: theme.spacing.md,
    width: '100%',
  },
  categoryHeaderImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  categoryHeaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  clearButton: {
    padding: 4,
  },
  searchResults: {
    position: 'absolute',
    top: 220,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.md,
    maxHeight: 400,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingRight: 2,
  },
  searchResultsScroll: {
    maxHeight: 400,
    paddingRight: 2,
  },
  searchResultItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchResultImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchResultDetails: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  noResultsText: {
    padding: 16,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  searchResultsSection: {
    fontSize: 16,
    fontWeight: '600',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  searchResultDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  mainTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  mainTitleText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
    fontFamily: 'SpaceMono',
    letterSpacing: 3,
    lineHeight: 48,
  },
  sourceText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#f6b44d',
    textAlign: 'center',
    includeFontPadding: false,
    fontFamily: 'SpaceMono',
    letterSpacing: 5,
    marginTop: 10,
    lineHeight: 40,
    paddingTop: 5,
  },
  orangeLine: {
    height: 4,
    backgroundColor: '#f6b44d',
    width: 100,
    borderRadius: 2,
    marginTop: 10,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'visible',
  },
  locationIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
});
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
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
  const { id: restaurantId } = useLocalSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart, removeFromCart, items, updateQuantity } = useCart();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});

  const restaurant = POPULAR_RESTAURANTS.find(r => r.id === Number(restaurantId));

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

  // Fonction pour obtenir la quantité d'un item dans le panier
  const getItemQuantity = (itemId: string, restaurantId?: number) => {
    return items.find(item => item.id === itemId && item.restaurantId === restaurantId)?.quantity || 0;
  };

  const handleAddToCart = (item: MenuItem) => {
    if (item.options && item.options.length > 0) {
      setSelectedItem(item);
      // Initialiser les options avec les premiers choix
      const initialOptions = item.options.reduce((acc, opt) => {
        acc[opt.name] = opt.choices[0].id;
        return acc;
      }, {} as Record<string, number>);
      setSelectedOptions(initialOptions);
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        restaurantId: restaurant?.id,
        restaurantName: restaurant?.name,
      });
    }
  };

  const handleOptionSelect = (optionName: string, choiceId: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: choiceId
    }));
  };

  const calculateTotalPrice = (item: MenuItem) => {
    if (!item.options) return item.price;
    
    return item.price + item.options.reduce((total, option) => {
      const selectedChoice = option.choices.find(
        choice => choice.id === selectedOptions[option.name]
      );
      return total + (selectedChoice?.price || 0);
    }, 0);
  };

  const renderOptionsModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        visible={!!selectedItem}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>{selectedItem.name}</ThemedText>
            
            {selectedItem.options?.map(option => (
              <View key={option.name} style={styles.optionContainer}>
                <ThemedText style={styles.optionTitle}>{option.name}</ThemedText>
                {option.choices.map(choice => (
                  <TouchableOpacity
                    key={choice.id}
                    style={[
                      styles.choiceButton,
                      selectedOptions[option.name] === choice.id && styles.selectedChoice
                    ]}
                    onPress={() => handleOptionSelect(option.name, choice.id)}
                  >
                    <ThemedText style={styles.choiceName}>
                      {choice.name}
                      {choice.price > 0 && ` (+${choice.price.toFixed(2)}€)`}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <View style={styles.modalFooter}>
              <ThemedText style={styles.totalPrice}>
                Total: {calculateTotalPrice(selectedItem).toFixed(2)}€
              </ThemedText>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  const selectedOptionsList = selectedItem.options?.map(option => ({
                    name: option.name,
                    choice: option.choices.find(c => c.id === selectedOptions[option.name])!
                  }));

                  addToCart({
                    id: selectedItem.id,
                    name: selectedItem.name,
                    price: calculateTotalPrice(selectedItem),
                    image: selectedItem.image,
                    restaurantId: restaurant?.id,
                    restaurantName: restaurant?.name,
                    selectedOptions: selectedOptionsList
                  });
                  setSelectedItem(null);
                }}
              >
                <ThemedText style={styles.addButtonText}>Ajouter au panier</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    );
  };

  // Rendu d'un item du menu
  const renderMenuItem = (item: MenuItem) => {
    const quantity = getItemQuantity(item.id, restaurant?.id);
    const isSection = item.price === 0;

    return (
      <TouchableOpacity 
        key={item.id}
        style={[
          styles.menuItem,
          isSection && styles.menuSection
        ]}
        onPress={() => {
          if (isSection) return;
          handleAddToCart(item);
        }}
      >
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemInfo}>
            <ThemedText style={[
              styles.menuItemName,
              isSection && styles.menuSectionName
            ]}>
              {item.name}
            </ThemedText>
            {!isSection && (
              <>
                <ThemedText style={styles.menuItemDescription}>
                  {item.description}
                </ThemedText>
                {item.options && (
                  <ThemedView style={styles.optionsIndicator}>
                    <ThemedText style={styles.optionsText}>
                      Options disponibles
                    </ThemedText>
                  </ThemedView>
                )}
                <ThemedView style={styles.priceAndControls}>
                  <ThemedText style={styles.menuItemPrice}>
                    {item.price.toFixed(2)}€
                  </ThemedText>
                  {quantity > 0 && (
                    <View style={styles.quantityControls}>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => {
                          if (quantity === 1) {
                            removeFromCart(item.id, restaurant?.id);
                          } else {
                            updateQuantity(item.id, quantity - 1, restaurant?.id);
                          }
                        }}
                      >
                        <Ionicons name="remove" size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                      <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleAddToCart(item)}
                      >
                        <Ionicons name="add" size={20} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </View>
                  )}
                </ThemedView>
              </>
            )}
          </View>
          {item.image && !isSection && (
            <Image 
              source={{ uri: item.image }} 
              style={styles.menuItemImage}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
          {filteredMenu.map((item) => renderMenuItem(item))}
        </ThemedView>
      </ScrollView>
      {renderOptionsModal()}
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
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuItemInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
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
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5B9',
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    color: theme.colors.primary,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  menuSection: {
    borderBottomWidth: 0,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'transparent',
  },
  menuSectionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  priceAndControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4, // Réduit l'espace
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionContainer: {
    marginBottom: 16,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  choiceButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  selectedChoice: {
    backgroundColor: '#FFE5B9',
    borderColor: theme.colors.primary,
  },
  choiceName: {
    fontSize: 14,
  },
  modalFooter: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 16,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsIndicator: {
    backgroundColor: '#FFE5B920',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  optionsText: {
    fontSize: 12,
    color: theme.colors.primary,
  },
}); 
import { ScrollView, StyleSheet, TouchableOpacity, View, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCart } from '@/contexts/CartContext';
import { theme } from '@/constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();

  // Grouper les articles par restaurant
  const groupedItems = items.reduce((groups, item) => {
    const restaurantId = item.restaurantId;
    const restaurantName = item.restaurantName;
    
    if (!groups[restaurantId]) {
      groups[restaurantId] = {
        name: restaurantName,
        items: []
      };
    }
    
    groups[restaurantId].items.push(item);
    return groups;
  }, {} as Record<number, { name: string; items: typeof items }>);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>Mon Panier</ThemedText>
        </ThemedView>

        {items.length === 0 ? (
          <ThemedView style={styles.emptyCart}>
            <Ionicons name="cart-outline" size={64} color={theme.colors.textSecondary} />
            <ThemedText style={styles.emptyCartText}>Votre panier est vide</ThemedText>
          </ThemedView>
        ) : (
          <>
            <ScrollView style={styles.itemsContainer}>
              {Object.entries(groupedItems).map(([restaurantId, restaurant]) => (
                <ThemedView key={restaurantId} style={styles.restaurantGroup}>
                  <ThemedText style={styles.restaurantName}>
                    {restaurant.name}
                  </ThemedText>
                  {restaurant.items.map((item) => (
                    <ThemedView key={`${restaurantId}-${item.id}`} style={styles.cartItem}>
                      {item.image && (
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                      )}
                      <ThemedView style={styles.itemInfo}>
                        <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                        
                        {/* Affichage des options sélectionnées */}
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <ThemedView style={styles.optionsContainer}>
                            {item.selectedOptions.map((option, index) => (
                              <ThemedText key={index} style={styles.optionText}>
                                {option.name}: {option.choice.name}
                                {option.choice.price > 0 && ` (+${option.choice.price.toFixed(2)}€)`}
                              </ThemedText>
                            ))}
                          </ThemedView>
                        )}

                        <ThemedText style={styles.itemPrice}>
                          {(item.price * item.quantity).toFixed(2)}€
                        </ThemedText>
                        <ThemedView style={styles.quantityContainer}>
                          <TouchableOpacity
                            onPress={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.id, item.quantity - 1, item.restaurantId);
                              } else {
                                removeFromCart(item.id, item.restaurantId);
                              }
                            }}
                          >
                            <Ionicons name="remove-circle" size={24} color={theme.colors.primary} />
                          </TouchableOpacity>
                          <ThemedText style={styles.quantity}>{item.quantity}</ThemedText>
                          <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity + 1, item.restaurantId)}
                          >
                            <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
                          </TouchableOpacity>
                        </ThemedView>
                      </ThemedView>
                      <TouchableOpacity
                        onPress={() => removeFromCart(item.id, item.restaurantId)}
                        style={styles.removeButton}
                      >
                        <Ionicons name="trash" size={24} color="red" />
                      </TouchableOpacity>
                    </ThemedView>
                  ))}
                </ThemedView>
              ))}
            </ScrollView>

            {/* Total et bouton de commande */}
            <ThemedView style={styles.footer}>
              <ThemedView style={styles.totalContainer}>
                <ThemedText style={styles.totalText}>Total</ThemedText>
                <ThemedText style={styles.totalAmount}>{getTotal().toFixed(2)}€</ThemedText>
              </ThemedView>
              <TouchableOpacity 
                style={styles.checkoutButton}
                onPress={() => router.push('/checkout')}
              >
                <ThemedText style={styles.checkoutButtonText}>Commander</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 18,
  },
  itemsContainer: {
    flex: 1,
  },
  restaurantGroup: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    color: theme.colors.primary,
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginTop: 4,
  },
  optionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
}); 
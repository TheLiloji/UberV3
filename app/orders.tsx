import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, SafeAreaView, Image, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance from '@/api/axiosInstance'; // Import the Axios instance
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  restaurantId?: string;
  restaurantName?: string;
  restaurantImage?: string;
  options?: string[];
}

interface Order {
  id: string;
  orderNumber?: string;
  multiRestaurant?: boolean;
  restaurants?: {
    id: string;
    name: string;
    image: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
  }[];
  restaurantId?: string;
  restaurantName?: string;
  restaurantImage?: string;
  items?: OrderItem[];
  groupedItems?: {
    [key: string]: {
      name: string;
      items: OrderItem[];
      subtotal: number;
      deliveryFee: number;
      image: string;
    }
  };
  totalPrice?: number;
  total?: number;
  deliveryAddress?: {
    address: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
    deliveryInstructions?: string;
    deliveryMethod?: string;
    icon?: string;
    id?: string;
    label?: string;
  };
  address?: string;
  deliveryTime?: string;
  status?: 'completed' | 'cancelled' | 'pending' | 'En préparation';
  date?: string;
  deliveryFee?: number;
}

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axiosInstance.get('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    return activeTab === 'current' ? order.status === 'pending' || order.status === 'En préparation' : order.status === 'completed';
  });

  const renderOrderItem = (item: OrderItem) => (
    <View key={item.id} style={styles.orderItemContainer}>
      <View style={styles.orderItemHeader}>
        <ThemedText style={styles.orderItem}>
          {item.quantity}x {item.name}
        </ThemedText>
        <ThemedText style={styles.itemPrice}>
          {item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}€
        </ThemedText>
      </View>
      {item.options && item.options.length > 0 && (
        <ThemedText style={styles.orderItemOptions}>
          {item.options.join(', ')}
        </ThemedText>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Commandes</ThemedText>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'current' && styles.activeTab]}
            onPress={() => setActiveTab('current')}
          >
            <ThemedText style={[
              styles.tabText,
              activeTab === 'current' && styles.activeTabText
            ]}>
              En cours
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <ThemedText style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText
            ]}>
              Anciens articles
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

// Fonction pour déterminer si une commande contient plusieurs restaurants
const isMultiRestaurantOrder = (order: Order) => {
  if (order.multiRestaurant) {
    return true;
  }
  
  if (order.groupedItems && Object.keys(order.groupedItems).length > 1) {
    return true;
  }
  
  if (order.restaurants && order.restaurants.length > 1) {
    return true;
  }
  
  return false;
};

const OrderCard = ({ order }: { order: Order }) => {
  // Calculer le total réel basé sur les articles
  const calculateTotal = () => {
    if (order.total) {
      return order.total;
    }
    
    if (order.totalPrice) {
      return order.totalPrice;
    }
    
    if (order.groupedItems) {
      return Object.values(order.groupedItems).reduce((total, restaurant) => {
        return total + restaurant.subtotal + restaurant.deliveryFee;
      }, 0);
    }
    
    if (order.multiRestaurant && order.restaurants) {
      return order.restaurants.reduce((total, restaurant) => {
        return total + restaurant.subtotal + restaurant.deliveryFee;
      }, 0);
    } 
    
    if (order.items) {
      const itemsTotal = order.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
      return itemsTotal + (order.deliveryFee || 0);
    }
    
    return 0;
  };

  const renderOrderItem = (item: OrderItem) => (
    <View key={item.id} style={styles.orderItemContainer}>
      <View style={styles.orderItemHeader}>
        <ThemedText style={styles.orderItem}>
          {item.quantity}x {item.name}
        </ThemedText>
        <ThemedText style={styles.itemPrice}>
          {item.price ? (item.price * item.quantity).toFixed(2) : '0.00'}€
        </ThemedText>
      </View>
      {item.options && item.options.length > 0 && (
        <ThemedText style={styles.orderItemOptions}>
          {item.options.join(', ')}
        </ThemedText>
      )}
    </View>
  );

  // Formater la date correctement
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date inconnue';
    
    try {
      // Si la date est déjà formatée en français
      if (dateString.includes('à') || dateString.includes('janvier') || 
          dateString.includes('février') || dateString.includes('mars')) {
        return dateString;
      }
      
      // Essayer différents formats de date
      let date;
      if (dateString.includes('T')) {
        // Format ISO
        date = new Date(dateString);
      } else if (dateString.includes('-')) {
        // Format YYYY-MM-DD
        date = new Date(dateString.replace(/-/g, '/'));
      } else {
        // Autre format
        date = new Date(dateString);
      }
      
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Erreur de formatage de date:', e);
      return 'Date invalide';
    }
  };

  // Fonction pour extraire l'adresse de livraison de manière sécurisée
  const getDeliveryAddress = () => {
    if (order.address.address && typeof order.address.address === 'string') {
      return order.address.address;
    }
    
    return 'Adresse inconnue';
  };

  // Gérer le cas où nous avons des groupedItems (nouveau format)
  if (order.groupedItems) {
    // Convertir l'objet groupedItems en tableau pour l'affichage
    const restaurants = Object.keys(order.groupedItems).map(restaurantId => {
      const restaurant = order.groupedItems![restaurantId];
      return {
        id: restaurantId,
        name: restaurant.name,
        image: restaurant.image,
        items: restaurant.items,
        subtotal: restaurant.subtotal,
        deliveryFee: restaurant.deliveryFee
      };
    });
    
    const isMulti = restaurants.length > 1;
    
    // Afficher les données brutes pour le débogage
    console.log("RESTAURANTS DATA:", JSON.stringify(restaurants, null, 2));
    
    return (
      <View style={styles.orderCard}>
        <ThemedText style={styles.orderLabel}>
          {isMulti ? 'Commande multi-restaurants' : 'Commande'}
          {order.orderNumber ? ` #${order.orderNumber}` : ''}
        </ThemedText>
        
        {restaurants.map((restaurant, index) => {
          // Afficher les données brutes de chaque restaurant pour le débogage
          console.log(`RESTAURANT ${index}:`, JSON.stringify(restaurant, null, 2));
          
          return (
            <View key={restaurant.id || index}>
              {index > 0 && <View style={styles.restaurantDivider} />}
              
              <View style={styles.restaurantInfo}>
                <View style={styles.restaurantImageContainer}>
                  <Image 
                    source={{ uri: restaurant.image || 'https://via.placeholder.com/60?text=Restaurant' }} 
                    style={styles.restaurantImage}
                  />
                </View>
                <View style={styles.orderInfo}>
                  <ThemedText style={styles.restaurantName}>
                    {restaurant.name || 'Restaurant inconnu'}
                  </ThemedText>
                  <ThemedText style={styles.subtotalText}>
                    Sous-total: {(restaurant.subtotal || 0).toFixed(2)}€
                  </ThemedText>
                  <ThemedText style={styles.deliveryFeeText}>
                    Frais de livraison: {(restaurant.deliveryFee || 0).toFixed(2)}€
                  </ThemedText>
                </View>
              </View>
            </View>
          );
        })}
        
        <View style={styles.orderFooter}>
          <ThemedText style={styles.orderDate}>
            {formatDate(order.date)}
          </ThemedText>
          <ThemedText style={styles.deliveryInfo}>
            {getDeliveryAddress()}
          </ThemedText>
        </View>
        
        <View style={styles.orderTotal}>
          <ThemedText style={styles.totalPrice}>
            Total: {calculateTotal().toFixed(2)}€
          </ThemedText>
        </View>
      </View>
    );
  }
  
  // Gérer le cas où nous avons des restaurants (ancien format)
  if (order.restaurants) {
    const isMulti = order.restaurants.length > 1;
    
    return (
      <View style={styles.orderCard}>
        <ThemedText style={styles.orderLabel}>
          {isMulti ? 'Commande multi-restaurants' : 'Commande'}
          {order.orderNumber ? ` #${order.orderNumber}` : ''}
        </ThemedText>
        
        {order.restaurants.map((restaurant, index) => (
          <View key={restaurant.id || index}>
            {index > 0 && <View style={styles.restaurantDivider} />}
            
            <View style={styles.restaurantInfo}>
              <View style={styles.restaurantImageContainer}>
                <Image 
                  source={{ uri: restaurant.image || 'https://via.placeholder.com/60?text=Restaurant' }} 
                  style={styles.restaurantImage}
                />
              </View>
              <View style={styles.orderInfo}>
                <ThemedText style={styles.restaurantName}>
                  {restaurant.name || 'Restaurant inconnu'}
                </ThemedText>
                <ThemedText style={styles.subtotalText}>
                  Sous-total: {(restaurant.subtotal || 0).toFixed(2)}€
                </ThemedText>
                <ThemedText style={styles.deliveryFeeText}>
                  Frais de livraison: {(restaurant.deliveryFee || 0).toFixed(2)}€
                </ThemedText>
              </View>
            </View>
            
            <View style={styles.orderItems}>
              {order.items && order.items.length > 0 ? 
                order.items.map(renderOrderItem) : 
                <ThemedText>Aucun article</ThemedText>
              }
            </View>
          </View>
        ))}
        
        <View style={styles.orderFooter}>
          <ThemedText style={styles.orderDate}>
            {formatDate(order.date)}
          </ThemedText>
          <ThemedText style={styles.deliveryInfo}>
            {getDeliveryAddress()}
          </ThemedText>
        </View>
        
        <View style={styles.orderTotal}>
          <ThemedText style={styles.totalPrice}>
            Total: {calculateTotal().toFixed(2)}€
          </ThemedText>
        </View>
      </View>
    );
  }
  
  // Gérer le cas d'une commande simple
  return (
    <View style={styles.orderCard}>
      <ThemedText style={styles.orderLabel}>
        Commande{order.orderNumber ? ` #${order.orderNumber}` : ''}
      </ThemedText>
      
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantImageContainer}>
          <Image 
            source={{ uri: order.restaurantImage || (order.items && order.items[0]?.restaurantImage) || 'https://via.placeholder.com/60?text=Restaurant' }} 
            style={styles.restaurantImage}
          />
        </View>
        <View style={styles.orderInfo}>
          <ThemedText style={styles.restaurantName}>
            {order.restaurantName || (order.items && order.items[0]?.restaurantName) || 'Restaurant inconnu'}
          </ThemedText>
          <ThemedText style={styles.orderDate}>
            {formatDate(order.date)}
          </ThemedText>
          <ThemedText style={styles.deliveryInfo}>
            {getDeliveryAddress()}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.orderItems}>
        {order.items && order.items.length > 0 ? 
          order.items.map(renderOrderItem) : 
          <ThemedText>Aucun article</ThemedText>
        }
      </View>
      
      <View style={styles.orderTotal}>
        <ThemedText style={styles.totalPrice}>
          Total: {calculateTotal().toFixed(2)}€
        </ThemedText>
      </View>
    </View>
  );
};

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
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginTop: Platform.OS === 'android' ? theme.spacing.md : 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.md,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  orderInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  deliveryInfo: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  orderItems: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  orderItemContainer: {
    marginBottom: theme.spacing.sm,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItem: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  orderItemOptions: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
    marginLeft: theme.spacing.sm,
    fontStyle: 'italic',
  },
  orderTotal: {
    marginTop: theme.spacing.md,
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderLabel: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  restaurantDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  orderFooter: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  subtotalText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  deliveryFeeText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
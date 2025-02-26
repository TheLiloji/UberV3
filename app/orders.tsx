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
  options?: string[];
}

interface Order {
  id: string;
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
  totalPrice: number;
  deliveryAddress?: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    deliveryInstructions?: string;
    deliveryMethod?: string;
    icon?: string;
    id?: string;
    label?: string;
  };
  deliveryTime: string;
  status: 'completed' | 'cancelled' | 'pending' | 'En préparation';
  date: string;
  deliveryFee: number;
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

const OrderCard = ({ order }: { order: Order }) => {
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

  if (order.multiRestaurant && order.restaurants) {
    return (
      <View style={styles.orderCard}>
        <ThemedText style={styles.multiRestaurantLabel}>
          Commande multi-restaurants
        </ThemedText>
        
        {order.restaurants.map((restaurant, index) => (
          <View key={restaurant.id}>
            {index > 0 && <View style={styles.restaurantDivider} />}
            <View style={styles.restaurantInfo}>
              <View style={styles.restaurantImageContainer}>
                <Image 
                  source={{ uri: restaurant.image }} 
                  style={styles.restaurantImage}
                />
              </View>
              <View style={styles.orderInfo}>
                <ThemedText style={styles.restaurantName}>
                  {restaurant.name}
                </ThemedText>
                <View style={styles.orderItems}>
                  {restaurant.items.map(renderOrderItem)}
                </View>
                <ThemedText style={styles.subtotalText}>
                  Sous-total: {restaurant.subtotal.toFixed(2)}€
                </ThemedText>
                <ThemedText style={styles.deliveryFeeText}>
                  Frais de livraison: {restaurant.deliveryFee.toFixed(2)}€
                </ThemedText>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.orderFooter}>
          <ThemedText style={styles.orderDate}>
            {order.date ? new Date(order.date.replace(/-/g, '/')).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Date inconnue'}
          </ThemedText>
          <ThemedText style={styles.deliveryInfo}>
            {order.deliveryAddress?.address || 'Adresse inconnue'}
          </ThemedText>
          <View style={styles.orderTotal}>
            <ThemedText style={styles.totalPrice}>
              Total: {order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}€
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.orderCard}>
      <View style={styles.restaurantInfo}>
        <View style={styles.restaurantImageContainer}>
          <Image 
            source={{ uri: order.restaurantImage }} 
            style={styles.restaurantImage}
          />
        </View>
        <View style={styles.orderInfo}>
          <ThemedText style={styles.restaurantName}>
            {order.restaurantName}
          </ThemedText>
          <ThemedText style={styles.orderDate}>
            {order.date ? new Date(order.date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Date inconnue'}
          </ThemedText>
          <ThemedText style={styles.deliveryInfo}>
            {order.address.address || 'Adresse inconnue'}
          </ThemedText>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items?.map(renderOrderItem)}
      </View>

      <View style={styles.orderTotal}>
        <ThemedText style={styles.totalPrice}>
          Total: {order.total ? order.total.toFixed(2) : '0.00'}€
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
  multiRestaurantLabel: {
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
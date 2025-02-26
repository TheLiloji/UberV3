import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, SafeAreaView, Image, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
  }[];
  restaurantId?: string;
  restaurantName?: string;
  restaurantImage?: string;
  items?: OrderItem[];
  totalPrice: number;
  deliveryAddress: string;
  deliveryTime: string;
  status: 'completed' | 'cancelled' | 'pending';
  date: string;
  deliveryFee: number;
}

const ORDERS: Order[] = [
  {
    id: '3',
    multiRestaurant: true,
    restaurants: [
      {
        id: 'etoile1',
        name: "L'ÉTOILE Ballainvilliers",
        image: 'https://picsum.photos/200/200?random=1',
        items: [
          {
            id: '5',
            name: 'Menu Kebab',
            quantity: 1,
            price: 15.90,
            options: ['Sauce Algérienne', 'Sans oignons']
          },
          {
            id: '5-2',
            name: 'Menu Kebab',
            quantity: 1,
            price: 15.90,
            options: ['Sauce Samouraï', 'Extra fromage']
          }
        ],
        subtotal: 31.80
      },
      {
        id: 'tacos1',
        name: 'Tacos Rolls',
        image: 'https://picsum.photos/200/200?random=2',
        items: [
          {
            id: '6',
            name: 'Tacos XXL',
            quantity: 1,
            price: 13.90
          }
        ],
        subtotal: 13.90
      }
    ],
    totalPrice: 45.70,
    deliveryAddress: '15 Avenue des Sciences, Aubière',
    deliveryTime: '35 min',
    status: 'completed',
    date: '2024-03-10',
    deliveryFee: 0
  },
  {
    id: '1',
    restaurantId: 'etoile1',
    restaurantName: "L'ÉTOILE Ballainvilliers",
    restaurantImage: 'https://picsum.photos/200/200?random=1',
    items: [
      {
        id: '1',
        name: 'Crousti-bowl',
        quantity: 1,
        price: 14.90
      },
      {
        id: '2',
        name: 'Sandwich kebab',
        quantity: 1,
        price: 12.90
      }
    ],
    totalPrice: 27.80,
    deliveryAddress: '17 rue de Romagnat, Aubière',
    deliveryTime: '25 min',
    status: 'completed',
    date: '2024-03-15',
    deliveryFee: 0
  },
  {
    id: '2',
    restaurantId: 'tacos1',
    restaurantName: 'Tacos Rolls',
    restaurantImage: 'https://picsum.photos/200/200?random=2',
    items: [
      {
        id: '3',
        name: 'Cheese Rolls gratiné',
        quantity: 1,
        price: 12.90
      },
      {
        id: '4',
        name: 'Maxi frites',
        quantity: 1,
        price: 4.00
      }
    ],
    totalPrice: 16.90,
    deliveryAddress: '22 All. Alan Turing, Clermont-Ferrand',
    deliveryTime: '20 min',
    status: 'completed',
    date: '2024-03-14',
    deliveryFee: 0
  }
];

export default function OrdersScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('past');

  const filteredOrders = ORDERS.filter(order => {
    return activeTab === 'current' ? order.status === 'pending' : order.status === 'completed';
  });

  const renderOrderItem = (item: OrderItem) => (
    <View key={item.id} style={styles.orderItemContainer}>
      <View style={styles.orderItemHeader}>
        <ThemedText style={styles.orderItem}>
          {item.quantity}x {item.name}
        </ThemedText>
        <ThemedText style={styles.itemPrice}>
          {(item.price * item.quantity).toFixed(2)}€
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
            <View key={order.id} style={styles.orderCard}>
              {order.items?.map(renderOrderItem)}
              <ThemedText style={styles.totalPrice}>
                Total: {order.totalPrice.toFixed(2)}€
              </ThemedText>
            </View>
          ))}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const OrderCard = ({ order }: { order: Order }) => {
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
              </View>
            </View>
          </View>
        ))}

        <View style={styles.orderFooter}>
          <ThemedText style={styles.orderDate}>
            {new Date(order.date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </ThemedText>
          <ThemedText style={styles.deliveryInfo}>
            {order.deliveryAddress}
          </ThemedText>
          <View style={styles.orderTotal}>
            <ThemedText style={styles.totalPrice}>
              Total: {order.totalPrice.toFixed(2)}€
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
            {new Date(order.date).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </ThemedText>
          <ThemedText style={styles.deliveryInfo}>
            {order.deliveryAddress}
          </ThemedText>
        </View>
      </View>

      <View style={styles.orderItems}>
        {order.items?.map(renderOrderItem)}
      </View>

      <View style={styles.orderTotal}>
        <ThemedText style={styles.totalPrice}>
          Total: {order.totalPrice.toFixed(2)}€
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
}); 
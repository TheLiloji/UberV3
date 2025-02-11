import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Colors from '../../constants/Colors';

interface MenuOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const MENU_OPTIONS: MenuOption[] = [
  {
    id: '1',
    title: 'Mon Compte',
    icon: 'person-outline',
    route: '/account',
  },
  {
    id: '2',
    title: 'Mes Commandes',
    icon: 'receipt-outline',
    route: '/orders',
  },
  {
    id: '3',
    title: 'Adresses de livraison',
    icon: 'location-outline',
    route: '/addresses',
  },
  {
    id: '4',
    title: 'Mode de paiement',
    icon: 'card-outline',
    route: '/payment-methods',
  },
  {
    id: '5',
    title: 'Panier',
    icon: 'cart-outline',
    route: '/cart',
  },
  {
    id: '6',
    title: 'Paramètres',
    icon: 'settings-outline',
    route: '/settings',
  },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* En-tête */}
      <ThemedView style={styles.header}>
        <ThemedText type="title">Mon Profil</ThemedText>
      </ThemedView>

      {/* Menu Options */}
      <ThemedView style={styles.menuContainer}>
        {MENU_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.menuItem}
            onPress={() => router.push(option.route)}
          >
            <ThemedView style={styles.menuItemContent}>
              <ThemedView style={styles.menuItemLeft}>
                <Ionicons name={option.icon} size={24} color="black" />
                <ThemedText style={styles.menuItemTitle}>{option.title}</ThemedText>
              </ThemedView>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {/* Bouton de déconnexion */}
      <TouchableOpacity style={styles.logoutButton}>
        <ThemedText style={styles.logoutText}>Se déconnecter</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.peach,
    backgroundColor: Colors.restaurantBackground,
  },
  menuContainer: {
    padding: 16,
    backgroundColor: Colors.restaurantBackground,
  },
  menuItem: {
    marginBottom: 16,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    marginLeft: 16,
    fontSize: 16,
    color: Colors.text,
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.peach,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

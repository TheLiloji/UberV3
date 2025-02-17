import { StyleSheet, TouchableOpacity, Image, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';

interface MenuOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
}

const MENU_OPTIONS: MenuOption[] = [
  {
    id: '1',
    title: 'Mon Profil',
    subtitle: 'Informations personnelles',
    icon: 'person-outline',
    route: '/account',
  },
  {
    id: '2',
    title: 'Mes Commandes',
    subtitle: 'Historique et suivi',
    icon: 'receipt-outline',
    route: '/orders',
  },
  {
    id: '3',
    title: 'Adresses de livraison',
    subtitle: 'Gérer mes adresses',
    icon: 'location-outline',
    route: '/saved-addresses',
  },
  {
    id: '4',
    title: 'Mode de paiement',
    subtitle: 'Cartes et moyens de paiement',
    icon: 'card-outline',
    route: '/payment-methods',
  },
  {
    id: '5',
    title: 'Panier',
    subtitle: 'Voir mon panier',
    icon: 'cart-outline',
    route: '/cart',
  },
  {
    id: '6',
    title: 'Paramètres',
    subtitle: "Préférences de l'application",
    icon: 'settings-outline',
    route: '/settings',
  },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* En-tête avec profil */}
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://picsum.photos/200' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <ThemedText type="title" style={styles.profileName}>John Doe</ThemedText>
          <ThemedText style={styles.profileEmail}>john.doe@example.com</ThemedText>
        </View>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        {MENU_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.menuItem}
            onPress={() => router.push(option.route)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={option.icon} size={24} color="#f6b44c" />
            </View>
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemText}>
                <ThemedText style={styles.menuItemTitle}>{option.title}</ThemedText>
                {option.subtitle && (
                  <ThemedText style={styles.menuItemSubtitle}>{option.subtitle}</ThemedText>
                )}
              </View>
              <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: theme.colors.primary,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffe5b9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

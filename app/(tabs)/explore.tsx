import { StyleSheet, TouchableOpacity, Image, View, ScrollView, TextInput, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { AnimatedCategoryTitle } from '@/components/AnimatedCategoryTitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '@/api/axiosInstance';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';
import { USER_DATA } from '@/constants/user';

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

// Fonction pour générer une couleur aléatoire mais cohérente basée sur une chaîne
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Générer une teinte dans la gamme des oranges/jaunes pour correspondre au thème
  const h = Math.abs(hash) % 60 + 30; // Teinte entre 30 et 90 (jaune-orange)
  const s = 80; // Saturation à 80%
  const l = 65; // Luminosité à 65%
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

// Composant pour afficher l'avatar avec l'initiale
const InitialsAvatar = ({ email, size = 40 }) => {
  // Obtenir la première lettre de l'email
  const initial = email ? email.charAt(0).toUpperCase() : '?';
  const backgroundColor = email ? stringToColor(email) : theme.colors.primary;
  
  return (
    <View 
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ThemedText 
        style={{
          color: 'white',
          fontSize: size * 0.5,
          fontWeight: 'bold',
        }}
      >
        {initial}
      </ThemedText>
    </View>
  );
};

// Fonction pour récupérer le profil utilisateur
const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axiosInstance.get('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export default function ExploreScreen() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);
  
  // Récupérer le profil utilisateur au chargement
  useEffect(() => {
    const loadUserProfile = async () => {
      const profile = await fetchUserProfile();
      if (profile) {
        setUserProfile(profile);
      }
    };
    loadUserProfile();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {userProfile ? (
            <>
              <TouchableOpacity 
                onPress={() => router.push('/account')}
                style={styles.avatarContainer}
              >
                {userProfile.avatar ? (
                  <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
                ) : (
                  <InitialsAvatar email={userProfile.email} size={40} />
                )}
              </TouchableOpacity>
              <View>
                <ThemedText style={styles.greeting}>Bonjour,</ThemedText>
                <ThemedText style={styles.userName}>
                  {userProfile.firstName || userProfile.email.split('@')[0]}
                </ThemedText>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity 
                onPress={() => router.push('/account')}
                style={styles.avatarContainer}
              >
                <InitialsAvatar email="?" size={40} />
              </TouchableOpacity>
              <View>
                <ThemedText style={styles.greeting}>Bonjour,</ThemedText>
                <ThemedText style={styles.userName}>Utilisateur</ThemedText>
              </View>
            </>
          )}
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
    </ThemedView>
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
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

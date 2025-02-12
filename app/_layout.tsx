import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { theme } from '@/constants/theme';
import { ThemedText } from '@/components/ThemedText';
import { CartProvider, useCart } from '@/contexts/CartContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Créer un composant séparé pour le bouton panier
function CartButton() {
  const router = useRouter();
  const pathname = usePathname();
  const isInRestaurant = pathname.startsWith('/restaurant/');
  const isInCart = pathname === '/cart';
  const { getCount, getTotal } = useCart();

  // Ne pas afficher le bouton sur la page panier
  if (isInCart) return null;

  return (
    <TouchableOpacity 
      style={[
        styles.cartButton,
        isInRestaurant ? styles.cartButtonWithoutNav : styles.cartButtonWithNav
      ]}
      onPress={() => router.push('/cart')}
    >
      <View style={styles.cartContent}>
        <Ionicons name="cart" size={24} color="white" />
        <ThemedText style={styles.cartCount}>{getCount()}</ThemedText>
      </View>
      <ThemedText style={styles.cartTotal}>{getTotal().toFixed(2)} €</ThemedText>
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <CartProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="restaurant" options={{ headerShown: false }} />
          <Stack.Screen name="cart" options={{ headerShown: false }} />
          <Stack.Screen name="address-selection" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        
        <CartButton />
        <StatusBar style="dark" />
      </ThemeProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  cartButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cartButtonWithNav: {
    bottom: Platform.select({
      ios: 83, // Hauteur de la barre de navigation iOS + marge
      android: 63, // Hauteur de la barre de navigation Android + marge
      default: 83,
    }),
  },
  cartButtonWithoutNav: {
    bottom: 20, // Juste une marge du bas quand il n'y a pas de barre de navigation
  },
  cartContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartCount: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  cartTotal: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 12,
    fontSize: 16,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.3)',
    paddingLeft: 12,
  },
});

import { StyleSheet, TouchableOpacity, View, SafeAreaView, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';

export default function PaymentConnectScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const getMethodLabel = () => {
    switch (params.method) {
      case 'paypal':
        return 'PayPal';
      case 'googlepay':
        return 'Google Pay';
      default:
        return '';
    }
  };

  const handleWebViewNavigationStateChange = (navState: any) => {
    // Détecter quand l'authentification est réussie
    if (navState.url.includes('success') || navState.url.includes('return')) {
      // Simuler la récupération des informations du compte
      const paymentMethod = {
        id: `${params.method}-${Date.now()}`,
        type: params.method,
        email: params.method === 'paypal' ? 'john.doe@paypal.com' : 'john.doe@gmail.com',
        isDefault: false
      };

      // Sauvegarder la méthode de paiement (à implémenter avec un vrai stockage)
      // savePaymentMethod(paymentMethod);

      // Retourner à la page des moyens de paiement avec les nouvelles informations
      router.push({
        pathname: '/payment-methods',
        params: { 
          newMethod: JSON.stringify(paymentMethod)
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>
            Connexion {getMethodLabel()}
          </ThemedText>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <ThemedText style={styles.loadingText}>
              Connexion en cours...
            </ThemedText>
          </View>
        )}

        <WebView
          source={{ 
            uri: params.method === 'paypal' 
              ? 'https://www.paypal.com/signin' 
              : 'https://pay.google.com/gp/w/u/0/home/signup'
          }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          onLoadEnd={() => setIsLoading(false)}
          style={[styles.webView, isLoading && styles.hidden]}
        />
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
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    marginTop: Platform.OS === 'android' ? theme.spacing.md : 0,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: theme.spacing.md,
  },
  webView: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
  },
}); 
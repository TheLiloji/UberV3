import { StyleSheet, TouchableOpacity, View, SafeAreaView, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';

export default function PaymentConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const getMethodIcon = () => {
    switch (params.method) {
      case 'card':
        return 'card-outline';
      case 'paypal':
        return 'logo-paypal';
      case 'googlepay':
        return 'logo-google';
      case 'applepay':
        return 'logo-apple';
      default:
        return 'card-outline';
    }
  };

  const getMethodLabel = () => {
    switch (params.method) {
      case 'card':
        return `Carte bancaire ****${params.last4}`;
      case 'paypal':
        return `Compte PayPal ${params.email}`;
      case 'googlepay':
        return `Compte Google Pay ${params.email}`;
      case 'applepay':
        return 'Compte Apple Pay';
      default:
        return 'Moyen de paiement';
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
          <ThemedText style={styles.headerTitle}>Confirmation</ThemedText>
        </View>

        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <ThemedText style={styles.loadingText}>
                Association en cours...
              </ThemedText>
            </View>
          ) : (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={64} color={theme.colors.primary} />
              </View>
              <ThemedText style={styles.successTitle}>
                Compte associé avec succès !
              </ThemedText>
              <View style={styles.methodContainer}>
                <Ionicons name={getMethodIcon()} size={24} color={theme.colors.text} />
                <ThemedText style={styles.methodText}>
                  {getMethodLabel()}
                </ThemedText>
              </View>
              <TouchableOpacity 
                style={styles.doneButton}
                onPress={() => router.push('/payment-methods')}
              >
                <ThemedText style={styles.doneButtonText}>Terminé</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    padding: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: theme.spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: theme.spacing.lg,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: theme.spacing.xl,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  methodText: {
    marginLeft: theme.spacing.md,
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.md,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 
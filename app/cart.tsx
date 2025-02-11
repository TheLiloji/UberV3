import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function CartScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      {/* En-tête */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <ThemedText type="title">Mon Panier</ThemedText>
        <ThemedView style={{ width: 24 }} /> {/* Pour centrer le titre */}
      </ThemedView>

      {/* Contenu du panier */}
      <ScrollView style={styles.content}>
        <ThemedText style={styles.emptyCart}>Votre panier est vide</ThemedText>
      </ScrollView>

      {/* Résumé de la commande */}
      <ThemedView style={styles.orderSummary}>
        <ThemedView style={styles.summaryRow}>
          <ThemedText>Sous-total</ThemedText>
          <ThemedText>0.00 €</ThemedText>
        </ThemedView>
        <ThemedView style={styles.summaryRow}>
          <ThemedText>Frais de livraison</ThemedText>
          <ThemedText>0.00 €</ThemedText>
        </ThemedView>
        <ThemedView style={[styles.summaryRow, styles.totalRow]}>
          <ThemedText type="title">Total</ThemedText>
          <ThemedText type="title">0.00 €</ThemedText>
        </ThemedView>

        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => router.back}
        >
          <ThemedText style={styles.checkoutButtonText}>
            Commander
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  content: {
    flex: 1,
  },
  emptyCart: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  orderSummary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  checkoutButton: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  checkoutButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';

export default function CardFormScreen() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleSave = () => {
    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    // Ici, vous pourriez ajouter la validation de la carte
    router.push({
      pathname: '/payment-confirmation',
      params: { 
        method: 'card',
        last4: cardNumber.slice(-4)
      }
    });
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
          <ThemedText style={styles.headerTitle}>Ajouter une carte</ThemedText>
        </View>

        <View style={styles.content}>
          <View style={styles.cardPreview}>
            <View style={styles.cardHeader}>
              <Ionicons name="card-outline" size={24} color={theme.colors.text} />
              <ThemedText style={styles.cardType}>VISA</ThemedText>
            </View>
            <ThemedText style={styles.cardNumberPreview}>
              {cardNumber || '•••• •••• •••• ••••'}
            </ThemedText>
            <View style={styles.cardFooter}>
              <ThemedText style={styles.cardHolderPreview}>
                {cardHolder || 'NOM DU TITULAIRE'}
              </ThemedText>
              <ThemedText style={styles.expiryPreview}>
                {expiryDate || 'MM/AA'}
              </ThemedText>
            </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Numéro de carte</ThemedText>
              <TextInput
                style={styles.input}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                placeholder="1234 5678 9012 3456"
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <ThemedText style={styles.label}>Date d'expiration</ThemedText>
                <TextInput
                  style={styles.input}
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  placeholder="MM/AA"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <ThemedText style={styles.label}>CVV</ThemedText>
                <TextInput
                  style={styles.input}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  maxLength={3}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Titulaire de la carte</ThemedText>
              <TextInput
                style={styles.input}
                value={cardHolder}
                onChangeText={setCardHolder}
                placeholder="JEAN DUPONT"
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <ThemedText style={styles.saveButtonText}>Enregistrer</ThemedText>
        </TouchableOpacity>
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
    padding: theme.spacing.md,
  },
  cardPreview: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  cardType: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardNumberPreview: {
    fontSize: 20,
    letterSpacing: 2,
    marginBottom: theme.spacing.xl,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHolderPreview: {
    fontSize: 14,
  },
  expiryPreview: {
    fontSize: 14,
  },
  form: {
    gap: theme.spacing.md,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.spacing.sm,
    padding: theme.spacing.md,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 
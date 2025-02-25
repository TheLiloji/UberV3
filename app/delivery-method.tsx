import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, ScrollView, Alert, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';
import axiosInstance from '@/api/axiosInstance'; // Import the Axios instance
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

type DeliveryMethod = 'hand' | 'dropoff';
type HandDeliveryOption = 'door' | 'outside' | 'lobby' | 'other';
type DropoffOption = 'frontdoor' | 'reception';

interface DeliveryMethodParams {
  label: string;
  address: string;
  latitude: string;
  longitude: string;
  icon: 'home' | 'business' | 'location';
  mode: 'add' | 'edit';
  addressId?: string;
}

export default function DeliveryMethodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<DeliveryMethodParams>();
  
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const [handDeliveryOption, setHandDeliveryOption] = useState<HandDeliveryOption | null>(null);
  const [dropoffOption, setDropoffOption] = useState<DropoffOption | null>(null);
  const [instructions, setInstructions] = useState('');

  const handleSave = async () => {
    if (!deliveryMethod) {
      Alert.alert('Erreur', 'Veuillez sélectionner un mode de livraison');
      return;
    }
  
    if (deliveryMethod === 'hand' && !handDeliveryOption) {
      Alert.alert('Erreur', 'Veuillez sélectionner une option de livraison en main propre');
      return;
    }
  
    if (deliveryMethod === 'dropoff' && !dropoffOption) {
      Alert.alert('Erreur', 'Veuillez sélectionner une option de dépôt');
      return;
    }
  
    const newAddress = {
      label: params.label,
      address: params.address,
      deliveryInstructions: instructions,
      deliveryMethod,
      deliveryOption: deliveryMethod === 'hand' ? handDeliveryOption : dropoffOption,
      icon: params.icon,
      coordinates: {
        latitude: parseFloat(params.latitude),
        longitude: parseFloat(params.longitude),
      }
    };
  
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axiosInstance.post('/api/addresses', newAddress, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.data) {
        router.push('/saved-addresses');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'ajout de l\'adresse');
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
          <ThemedText style={styles.headerTitle}>Mode de livraison</ThemedText>
        </View>

        <ScrollView style={styles.content}>
          {/* Méthode de livraison */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Comment souhaitez-vous être livré ?</ThemedText>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  deliveryMethod === 'hand' && styles.optionButtonSelected
                ]}
                onPress={() => setDeliveryMethod('hand')}
              >
                <Ionicons 
                  name="hand-left" 
                  size={24} 
                  color={deliveryMethod === 'hand' ? 'white' : theme.colors.text} 
                />
                <ThemedText style={[
                  styles.optionText,
                  deliveryMethod === 'hand' && styles.optionTextSelected
                ]}>
                  En main propre
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  deliveryMethod === 'dropoff' && styles.optionButtonSelected
                ]}
                onPress={() => setDeliveryMethod('dropoff')}
              >
                <Ionicons 
                  name="location" 
                  size={24} 
                  color={deliveryMethod === 'dropoff' ? 'white' : theme.colors.text} 
                />
                <ThemedText style={[
                  styles.optionText,
                  deliveryMethod === 'dropoff' && styles.optionTextSelected
                ]}>
                  À déposer
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Options de livraison en main propre */}
          {deliveryMethod === 'hand' && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Où voulez-vous récupérer votre commande ?</ThemedText>
              <View style={styles.subOptionsContainer}>
                {[
                  { id: 'door', label: 'À ma porte', icon: 'home-outline' },
                  { id: 'outside', label: 'À l\'extérieur', icon: 'walk-outline' },
                  { id: 'lobby', label: 'Dans le hall', icon: 'business-outline' },
                  { id: 'other', label: 'Autre', icon: 'ellipsis-horizontal-outline' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.subOptionButton,
                      handDeliveryOption === option.id && styles.subOptionButtonSelected
                    ]}
                    onPress={() => setHandDeliveryOption(option.id as HandDeliveryOption)}
                  >
                    <Ionicons 
                      name={option.icon} 
                      size={20} 
                      color={handDeliveryOption === option.id ? 'white' : theme.colors.text} 
                    />
                    <ThemedText style={[
                      styles.subOptionText,
                      handDeliveryOption === option.id && styles.subOptionTextSelected
                    ]}>
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Options de dépôt */}
          {deliveryMethod === 'dropoff' && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Où déposer votre commande ?</ThemedText>
              <View style={styles.subOptionsContainer}>
                {[
                  { id: 'frontdoor', label: 'Devant la porte', icon: 'home-outline' },
                  { id: 'reception', label: 'À l\'accueil', icon: 'business-outline' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.subOptionButton,
                      dropoffOption === option.id && styles.subOptionButtonSelected
                    ]}
                    onPress={() => setDropoffOption(option.id as DropoffOption)}
                  >
                    <Ionicons 
                      name={option.icon} 
                      size={20} 
                      color={dropoffOption === option.id ? 'white' : theme.colors.text} 
                    />
                    <ThemedText style={[
                      styles.subOptionText,
                      dropoffOption === option.id && styles.subOptionTextSelected
                    ]}>
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Instructions de livraison */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Instructions supplémentaires</ThemedText>
            <TextInput
              style={styles.instructionsInput}
              placeholder="Ex: Code d'entrée, étage, etc."
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

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
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  optionButton: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  optionButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: 'white',
  },
  subOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  subOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.backgroundSecondary,
    gap: theme.spacing.xs,
  },
  subOptionButtonSelected: {
    backgroundColor: theme.colors.primary,
  },
  subOptionText: {
    fontSize: 14,
  },
  subOptionTextSelected: {
    color: 'white',
  },
  instructionsInput: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
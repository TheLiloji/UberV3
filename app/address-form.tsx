import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, ScrollView, Platform, StatusBar, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';
import { GOOGLE_PLACES_API_KEY } from '@/constants/config';

interface AddressFormParams {
  mode: 'add' | 'edit';
  addressId?: string;
}

const ICON_OPTIONS = [
  { id: 'home', label: 'Maison', color: '#4CAF50' },
  { id: 'business', label: 'Bureau', color: '#2196F3' },
  { id: 'location', label: 'Autre', color: '#FF9800' },
] as const;

export default function AddressFormScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<AddressFormParams>();
  
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState({
    latitude: 45.7712,
    longitude: 3.0856,
  });
  const [icon, setIcon] = useState<'home' | 'business' | 'location'>('home');

  const handleSave = () => {
    if (!label || !address) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Ici on passera à l'écran des instructions de livraison
    router.push({
      pathname: '/delivery-method',
      params: {
        label,
        address,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        icon,
        mode: params.mode,
        addressId: params.addressId,
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
          <ThemedText style={styles.headerTitle}>
            {params.mode === 'add' ? 'Nouvelle adresse' : 'Modifier l\'adresse'}
          </ThemedText>
        </View>

        <View style={styles.content}>
          {/* Section de l'adresse */}
          <View style={[styles.addressSection]}>
            <ThemedText style={styles.sectionTitle}>Adresse</ThemedText>
            <GooglePlacesAutocomplete
              placeholder="Rechercher une adresse"
              onPress={(data, details = null) => {
                if (details) {
                  setAddress(data.description);
                  setCoordinates({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  });
                }
              }}
              query={{
                key: GOOGLE_PLACES_API_KEY,
                language: 'fr',
                components: 'country:fr',
              }}
              styles={{
                container: {
                  flex: 0,
                },
                textInput: {
                  height: 50,
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderRadius: theme.borderRadius.md,
                  paddingHorizontal: theme.spacing.md,
                  fontSize: 16,
                  color: theme.colors.text,
                },
                listView: {
                  backgroundColor: theme.colors.background,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: theme.borderRadius.md,
                  marginTop: 5,
                },
                row: {
                  padding: theme.spacing.md,
                  backgroundColor: theme.colors.background,
                },
                description: {
                  color: theme.colors.text,
                },
              }}
              enablePoweredByContainer={false}
              fetchDetails={true}
              keyboardShouldPersistTaps="handled"
            />
          </View>

          {/* Section du nom */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Nom de l'adresse</ThemedText>
            <TextInput
              style={styles.input}
              value={label}
              onChangeText={setLabel}
              placeholder="Ex: Maison, Bureau, etc."
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>

          {/* Section des icônes */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Choisir une icône</ThemedText>
            <View style={styles.iconOptionsContainer}>
              {ICON_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.iconOption,
                    icon === option.id && styles.iconOptionSelected,
                    { backgroundColor: `${option.color}15` }
                  ]}
                  onPress={() => setIcon(option.id)}
                >
                  <View style={[
                    styles.iconContainer,
                    icon === option.id && { backgroundColor: option.color }
                  ]}>
                    <Ionicons 
                      name={option.id} 
                      size={24} 
                      color={icon === option.id ? 'white' : option.color} 
                    />
                  </View>
                  <ThemedText style={styles.iconLabel}>{option.label}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleSave}
        >
          <ThemedText style={styles.continueButtonText}>Continuer</ThemedText>
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
    padding: theme.spacing.md,
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  addressSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
  },
  iconOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
    zIndex: 0,
  },
  iconOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
  },
  iconOptionSelected: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconLabel: {
    fontSize: 14,
    marginTop: theme.spacing.xs,
  },
  continueButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
}); 
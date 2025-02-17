import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, ScrollView, Image, SafeAreaView, Platform, StatusBar, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';

type DeliveryMethod = 'hand' | 'dropoff';
type HandDeliveryOption = 'door' | 'outside' | 'lobby' | 'other';
type DropoffOption = 'frontdoor' | 'reception';

export default function DeliveryInstructionsScreen() {
  const router = useRouter();
  const { selectedAddress, latitude, longitude, deliveryInstructions, deliveryMethod: initialDeliveryMethod } = useLocalSearchParams();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(initialDeliveryMethod as DeliveryMethod || null);
  const [handDeliveryOption, setHandDeliveryOption] = useState<HandDeliveryOption | null>(null);
  const [dropoffOption, setDropoffOption] = useState<DropoffOption | null>(null);
  const [instructions, setInstructions] = useState(deliveryInstructions as string || '');
  const [photo, setPhoto] = useState<string | null>(null);

  const initialRegion = {
    latitude: parseFloat(latitude as string) || 48.866667,
    longitude: parseFloat(longitude as string) || 2.333333,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const handleImagePick = async () => {
    try {
      // Demander la permission pour les photos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Nous avons besoin de votre permission pour accéder à vos photos');
        return;
      }

      // Lancer le sélecteur d'images avec plus d'options
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        presentationStyle: 'pageSheet',
        selectionLimit: 1,
      });

      console.log('Résultat ImagePicker:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        console.log('Image sélectionnée:', selectedAsset);
        setPhoto(selectedAsset.uri);
      } else {
        console.log('Sélection annulée ou pas d\'image');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
      alert('Une erreur est survenue lors de la sélection de l\'image');
    }
  };

  const handleSubmit = () => {
    // Ici, vous pourriez sauvegarder les préférences de livraison
    console.log({
      deliveryMethod,
      option: deliveryMethod === 'hand' ? handDeliveryOption : dropoffOption,
      instructions,
      photo,
    });
    router.push({
      pathname: '/',
      params: { selectedAddress }
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
          <ThemedText style={styles.headerTitle}>Instructions de livraison</ThemedText>
        </View>

        <ScrollView style={styles.scrollContent}>
          {/* Carte avec l'adresse */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Adresse de livraison</ThemedText>
            <View style={styles.addressContainer}>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={initialRegion}
                  scrollEnabled={true}
                  zoomEnabled={true}
                  minZoomLevel={12}
                  maxZoomLevel={20}
                  rotateEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: initialRegion.latitude,
                      longitude: initialRegion.longitude,
                    }}
                  />
                </MapView>
              </View>
              <ThemedView style={styles.addressInfo}>
                <TouchableOpacity 
                  style={styles.addressButton}
                  onPress={() => {
                    router.push({
                      pathname: '/address-selection',
                      params: {
                        returnTo: 'delivery-instructions',
                        deliveryMethod,
                        handDeliveryOption,
                        dropoffOption,
                        instructions,
                        photo
                      }
                    });
                  }}
                >
                  <View style={styles.addressContent}>
                    <Ionicons name="location" size={24} color={theme.colors.primary} />
                    <View style={styles.addressTextContainer}>
                      <ThemedText style={styles.addressText}>{selectedAddress}</ThemedText>
                      <ThemedText style={styles.editText}>Modifier l'adresse</ThemedText>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </ThemedView>
            </View>
          </View>

          {/* Méthode de livraison */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Mode de livraison</ThemedText>
            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.methodOption,
                  deliveryMethod === 'hand' && styles.selectedOption
                ]}
                onPress={() => setDeliveryMethod('hand')}
              >
                <Ionicons 
                  name="hand-left-outline" 
                  size={24} 
                  color={deliveryMethod === 'hand' ? 'white' : theme.colors.text} 
                />
                <ThemedText style={[
                  styles.optionText,
                  deliveryMethod === 'hand' && styles.selectedOptionText
                ]}>En main propre</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.methodOption,
                  deliveryMethod === 'dropoff' && styles.selectedOption
                ]}
                onPress={() => setDeliveryMethod('dropoff')}
              >
                <Ionicons 
                  name="location-outline" 
                  size={24} 
                  color={deliveryMethod === 'dropoff' ? 'white' : theme.colors.text} 
                />
                <ThemedText style={[
                  styles.optionText,
                  deliveryMethod === 'dropoff' && styles.selectedOptionText
                ]}>Laisser sur place</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Options spécifiques selon la méthode */}
          {deliveryMethod === 'hand' && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Point de rencontre</ThemedText>
              <View style={styles.optionsContainer}>
                {[
                  { id: 'door' as const, label: 'Rendez-vous à ma porte', icon: 'home-outline' },
                  { id: 'outside' as const, label: 'Rendez-vous à l\'extérieur', icon: 'walk-outline' },
                  { id: 'lobby' as const, label: 'Rendez-vous dans le hall', icon: 'business-outline' },
                  { id: 'other' as const, label: 'Autre', icon: 'ellipsis-horizontal-outline' },
                ].map((option) => (
                  <TouchableOpacity 
                    key={option.id}
                    style={[
                      styles.subOption,
                      handDeliveryOption === option.id && styles.selectedOption
                    ]}
                    onPress={() => setHandDeliveryOption(option.id)}
                  >
                    <Ionicons 
                      name={option.icon as any} 
                      size={24} 
                      color={handDeliveryOption === option.id ? 'white' : theme.colors.text} 
                    />
                    <ThemedText style={[
                      styles.subOptionText,
                      handDeliveryOption === option.id && styles.selectedOptionText
                    ]}>{option.label}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {deliveryMethod === 'dropoff' && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Lieu de dépôt</ThemedText>
              <View style={styles.optionsContainer}>
                {[
                  { id: 'frontdoor' as const, label: 'Déposer devant ma porte', icon: 'home-outline' },
                  { id: 'reception' as const, label: 'Déposer à l\'accueil', icon: 'business-outline' },
                ].map((option) => (
                  <TouchableOpacity 
                    key={option.id}
                    style={[
                      styles.subOption,
                      dropoffOption === option.id && styles.selectedOption
                    ]}
                    onPress={() => setDropoffOption(option.id)}
                  >
                    <Ionicons 
                      name={option.icon} 
                      size={24} 
                      color={dropoffOption === option.id ? 'white' : theme.colors.text} 
                    />
                    <ThemedText style={[
                      styles.subOptionText,
                      dropoffOption === option.id && styles.selectedOptionText
                    ]}>{option.label}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Instructions supplémentaires */}
          {deliveryMethod && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Instructions pour le livreur</ThemedText>
              <TextInput
                style={styles.instructionsInput}
                value={instructions}
                onChangeText={setInstructions}
                placeholder="Ex: Code d'entrée, étage, numéro d'appartement..."
                multiline
                numberOfLines={4}
              />
            </View>
          )}

          {/* Photo */}
          {deliveryMethod && (
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Photo du lieu de livraison</ThemedText>
              <TouchableOpacity 
                style={styles.photoButton}
                onPress={handleImagePick}
              >
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photoPreview} />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={24} color={theme.colors.primary} />
                    <ThemedText style={styles.photoButtonText}>Ajouter une photo</ThemedText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Bouton de validation */}
        {deliveryMethod && (
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <ThemedText style={styles.submitButtonText}>Valider</ThemedText>
            </TouchableOpacity>
          </View>
        )}
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
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
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
    gap: theme.spacing.sm,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontSize: 16,
  },
  selectedOptionText: {
    color: 'white',
  },
  subOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  subOptionText: {
    fontSize: 14,
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  photoButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    minHeight: 120,
  },
  photoButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    marginTop: 8,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 200,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: theme.spacing.sm,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  addressContainer: {
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.backgroundSecondary,
    overflow: 'hidden',
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: theme.spacing.sm,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressTextContainer: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  addressText: {
    fontSize: 16,
  },
  editText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 2,
  },
}); 
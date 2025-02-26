import 'react-native-get-random-values';
import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axiosInstance from '@/api/axiosInstance'; // Import the Axios instance
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  deliveryInstructions?: string;
  deliveryMethod: 'hand' | 'dropoff';
  deliveryOption?: string;
  icon: 'home' | 'business' | 'location';
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const SAVED_ADDRESSES: SavedAddress[] = [
  {
    id: '1',
    label: 'Maison',
    address: '17 rue de Romagnat, Aubière, France',
    deliveryInstructions: 'Code: 1234, 2ème étage droite',
    deliveryMethod: 'hand',
    deliveryOption: 'door',
    icon: 'home',
    coordinates: {
      latitude: 45.7590,
      longitude: 3.1108
    }
  },
  {
    id: '2',
    label: 'Bureau',
    address: '22 All. Alan Turing, 63000 Clermont-Ferrand, France',
    deliveryInstructions: 'Bâtiment B, 3ème étage',
    deliveryMethod: 'dropoff',
    deliveryOption: 'reception',
    icon: 'business',
    coordinates: {
      latitude: 45.7595,
      longitude: 3.1301
    }
  },
  {
    id: '3',
    label: 'Salle de sport',
    address: '5 Rue des Sports, 63000 Clermont-Ferrand',
    deliveryMethod: 'hand',
    deliveryOption: 'outside',
    icon: 'location',
    coordinates: {
      latitude: 45.7712,
      longitude: 3.0856
    }
  }
];

// Remplacer par votre clé API Google
const GOOGLE_PLACES_API_KEY = 'AIzaSyAPZgtRa3ozBfhxlNLptXmR9hPL8sivT6c';

const fetchAddresses = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axiosInstance.get('/api/addresses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
};

const addAddress = async (newAddress) => {
  try {
    const token = await AsyncStorage.getItem('token');

    console.log(newAddress);
    const response = await axiosInstance.post('/api/addresses', newAddress, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error adding address:', error, "Request:", error.request);
    return null;
  }
};

export default function AddressSelectionScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const loadAddresses = async () => {
      const fetchedAddresses = await fetchAddresses();
      setAddresses(fetchedAddresses);
    };
    loadAddresses();
  }, []);

  const handleAddressSelect = (savedAddress) => {
    // Vérifier d'où vient l'utilisateur
    const previousScreen = router.canGoBack() ? 'previous' : 'home';
    
    if (previousScreen === 'previous') {
      // Si l'utilisateur vient d'un autre écran (comme order.tsx), retourner à cet écran
      // et stocker l'adresse dans AsyncStorage pour qu'elle puisse être récupérée
      AsyncStorage.setItem('selectedAddress', savedAddress.address);
      router.back();
    } else {
      // Sinon, aller à l'écran d'accueil avec l'adresse en paramètre
      router.push({
        pathname: '/',
        params: { 
          selectedAddress: savedAddress.address 
        }
      });
    }
  };

  const handleAddAddress = async (data, details) => {
    if (details) {
      const formattedAddress = details.formatted_address;
      const coordinates = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      };

      // Vérification pour s'assurer que l'adresse est complète
      if (!formattedAddress.match(/^\d+\s[A-z]+\s[A-z]+/)) {
        alert("Veuillez sélectionner une adresse complète.");
        return; // Ne pas ajouter l'adresse si elle n'est pas complète
      }

      // Naviguer vers la page des instructions de livraison et passer les paramètres
      router.push({
        pathname: '/delivery-instructions',
        params: {
          selectedAddress: formattedAddress,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          deliveryInstructions: '', // Passer les instructions si nécessaire
          deliveryMethod: 'hand', // Passer une valeur par défaut ou ajuster selon vos besoins
        }
      });
    }
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission de localisation refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Utiliser l'API Google Geocoding pour obtenir une adresse plus précise
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.coords.latitude},${location.coords.longitude}&key=${GOOGLE_PLACES_API_KEY}&language=fr`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const formattedAddress = data.results[0].formatted_address;
        setCurrentLocation({
          label: 'Nouvelle adresse',
          address: formattedAddress,
          coordinates: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          icon: 'location', // Default icon
        });

        // Naviguer vers la page des instructions de livraison avec les informations
        router.push({
          pathname: '/delivery-instructions',
          params: {
            selectedAddress: formattedAddress,
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
            icon: 'location',
            deliveryInstructions: '',
            deliveryMethod: 'hand',
          }
        });
      } else {
        alert('Aucune adresse trouvée pour la position actuelle.');
      }
    } catch (error) {
      alert('Erreur lors de la récupération de la position');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Sélectionner une adresse</ThemedText>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBarWrapper}>
            <Ionicons name="search" size={24} color="#666" style={styles.searchIcon} />
            <GooglePlacesAutocomplete
              placeholder="Saisir une adresse"
              onPress={(data, details = null) => {
                handleAddAddress(data, details);
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
                  fontSize: 16,
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: theme.colors.primary,
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingLeft: 45,
                  color: '#000',
                },
                listView: {
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#f0f0f0',
                  borderRadius: 8,
                  marginTop: 8,
                  position: 'absolute',
                  top: 55,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  elevation: 3,
                },
                row: {
                  padding: 15,
                  height: 'auto',
                  minHeight: 50,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                },
                description: {
                  fontSize: 14,
                  color: '#333',
                },
                predefinedPlacesDescription: {
                  color: '#333',
                },
              }}
              renderLeftButton={() => (
                <View style={styles.searchIcon}>
                  <Ionicons name="search" size={24} color="#666" />
                </View>
              )}
              fetchDetails={true}
              enablePoweredByContainer={false}
              debounce={300}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.currentLocationButton}
            onPress={getCurrentLocation}
          >
            <Ionicons name="locate" size={24} color={theme.colors.primary} />
            <ThemedText style={styles.currentLocationText}>Position actuelle</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Adresses enregistrées</ThemedText>
            {addresses.map((savedAddress) => (
              <TouchableOpacity
                key={savedAddress.id}
                style={styles.addressItem}
                onPress={() => handleAddressSelect(savedAddress)}
              >
                <View style={styles.addressIcon}>
                  <Ionicons 
                    name={savedAddress.icon} 
                    size={24} 
                    color={theme.colors.primary} 
                  />
                </View>
                <View style={styles.addressDetails}>
                  <View style={styles.addressHeader}>
                    <ThemedText style={styles.addressLabel}>{savedAddress.label}</ThemedText>
                    <View style={styles.deliveryMethodBadge}>
                      <Ionicons 
                        name={savedAddress.deliveryMethod === 'hand' ? 'hand-left' : 'location'} 
                        size={16} 
                        color={theme.colors.primary} 
                      />
                      <ThemedText style={styles.deliveryMethodText}>
                        {savedAddress.deliveryMethod === 'hand' ? 'En main propre' : 'À déposer'}
                      </ThemedText>
                    </View>
                  </View>
                  <ThemedText style={styles.addressText}>{savedAddress.address}</ThemedText>
                  {savedAddress.deliveryInstructions && (
                    <ThemedText style={styles.instructionsText}>
                      {savedAddress.deliveryInstructions}
                    </ThemedText>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ThemedView>
    </View>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee5b9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
    marginLeft: 12,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  addressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  instructionsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    zIndex: 1000,
  },
  searchBarWrapper: {
    position: 'relative',
    marginBottom: theme.spacing.sm,
  },
  searchIcon: {
    position: 'absolute',
    top: 13,
    left: 12,
    zIndex: 1,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  currentLocationText: {
    fontSize: 16,
  },
  deliveryMethodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  deliveryMethodText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
});
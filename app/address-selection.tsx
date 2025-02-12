import 'react-native-get-random-values';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

// Simulons des adresses sauvegardées
const SAVED_ADDRESSES = [
  {
    id: '1',
    name: 'Maison',
    address: '123 Rue de la Paix, Paris',
  },
  {
    id: '2',
    name: 'Bureau',
    address: '456 Avenue des Champs-Élysées, Paris',
  },
];

// Remplacer par votre clé API Google
const GOOGLE_PLACES_API_KEY = 'AIzaSyAPZgtRa3ozBfhxlNLptXmR9hPL8sivT6c';

export default function AddressSelectionScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddressSelect = (address: string) => {
    router.push({
      pathname: '/',
      params: { selectedAddress: address }
    });
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
        // Prendre la première adresse trouvée (la plus précise)
        const formattedAddress = data.results[0].formatted_address;
        handleAddressSelect(formattedAddress);
      } else {
        // Fallback sur la géolocalisation Expo si Google échoue
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (address[0]) {
          const formattedAddress = `${address[0].street}, ${address[0].city}`;
          handleAddressSelect(formattedAddress);
        }
      }
    } catch (error) {
      alert('Erreur lors de la récupération de la position');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <ThemedText type="title">Sélectionner une adresse</ThemedText>
        <View style={{ width: 24 }} />
      </ThemedView>

      {/* Search Bar with Google Places Autocomplete */}
      <ThemedView style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Saisir une adresse"
          onPress={(data, details = null) => {
            handleAddressSelect(data.description);
          }}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: 'fr',
            components: 'country:fr',
          }}
          styles={{
            container: {
              flex: 0,
              width: '100%',
            },
            textInputContainer: {
              width: '100%',
              backgroundColor: 'transparent',
            },
            textInput: {
              height: 50,
              fontSize: 16,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#f5b44d',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingLeft: 45, // Espace pour l'icône
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
      </ThemedView>

      <ScrollView style={styles.content}>
        {/* Current Location Button */}
        <TouchableOpacity 
          style={styles.locationButton} 
          onPress={getCurrentLocation}
          disabled={loading}
        >
          <ThemedView style={styles.locationIconContainer}>
            <Ionicons name="locate" size={24} color="black" />
          </ThemedView>
          <ThemedText style={styles.locationButtonText}>
            {loading ? 'Localisation en cours...' : 'Utiliser ma position actuelle'}
          </ThemedText>
        </TouchableOpacity>

        {/* Saved Addresses */}
        <ThemedView style={styles.savedAddressesContainer}>
          <ThemedText style={styles.sectionTitle}>Adresses enregistrées</ThemedText>
          {SAVED_ADDRESSES.map((savedAddress) => (
            <TouchableOpacity
              key={savedAddress.id}
              style={styles.savedAddressItem}
              onPress={() => handleAddressSelect(savedAddress.address)}
            >
              <Ionicons name="location-outline" size={24} color="#666" />
              <ThemedView style={styles.savedAddressText}>
                <ThemedText style={styles.savedAddressName}>{savedAddress.name}</ThemedText>
                <ThemedText style={styles.savedAddressDetails}>{savedAddress.address}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    position: 'relative',
    zIndex: 1,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 13,
    zIndex: 2,
  },
  content: {
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee5b9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationButtonText: {
    fontSize: 16,
  },
  savedAddressesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  savedAddressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  savedAddressText: {
    marginLeft: 12,
  },
  savedAddressName: {
    fontSize: 16,
    fontWeight: '500',
  },
  savedAddressDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
}); 
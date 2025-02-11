import { StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function AddressSelectionScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (address[0]) {
          const { street, name, city, postalCode } = address[0];
          setCurrentLocation(`${street || name}, ${postalCode} ${city}`);
        }
      }
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAddress = (address: string) => {
    // Ici, vous pourriez sauvegarder l'adresse dans un état global ou AsyncStorage
    router.push({
      pathname: '/(tabs)',
      params: { selectedAddress: address }
    });
  };

  const SAMPLE_ADDRESSES = [
    "15 rue de la République, 69001 Lyon",
    "25 avenue Jean Jaurès, 69007 Lyon",
    "45 cours Lafayette, 69003 Lyon",
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <ThemedText type="title">Sélectionner une adresse</ThemedText>
        <ThemedView style={{ width: 24 }} />
      </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <ThemedView style={styles.searchBar}>
          <Ionicons name="search" size={24} color="#666" />
          <TextInput 
            placeholder="Rechercher une adresse"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </ThemedView>
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.addAddressButton}
            onPress={() => handleSelectAddress(searchQuery)}
          >
            <Ionicons name="add-circle-outline" size={24} color="black" />
            <ThemedText style={styles.addAddressText}>
              Ajouter "{searchQuery}"
            </ThemedText>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedView style={styles.addressList}>
        {/* Position actuelle */}
        <TouchableOpacity 
          style={styles.addressItem}
          onPress={() => currentLocation && handleSelectAddress(currentLocation)}
        >
          <Ionicons name="locate-outline" size={24} color="black" />
          <ThemedView style={styles.addressInfo}>
            <ThemedText style={styles.addressText}>
              {isLoading ? 'Chargement...' : 
               currentLocation || 'Position actuelle non disponible'}
            </ThemedText>
          </ThemedView>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        {/* Adresses sauvegardées */}
        {SAMPLE_ADDRESSES.map((address, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.addressItem}
            onPress={() => handleSelectAddress(address)}
          >
            <Ionicons name="location-outline" size={24} color="black" />
            <ThemedView style={styles.addressInfo}>
              <ThemedText style={styles.addressText}>{address}</ThemedText>
            </ThemedView>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  addressList: {
    flex: 1,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressText: {
    fontSize: 16,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addAddressText: {
    fontSize: 16,
    color: '#666',
  },
}); 
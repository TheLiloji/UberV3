import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Alert, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';
import { PageTransition } from '@/components/PageTransition';
import axiosInstance from '@/api/axiosInstance'; // Import the Axios instance
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

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

const fetchAddresses = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
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

const deleteAddress = async (addressId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    await axiosInstance.delete(`/api/addresses/${addressId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error deleting address:', error);
  }
};

export default function ExploreScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  useEffect(() => {
    const loadAddresses = async () => {
      const fetchedAddresses = await fetchAddresses();
      setAddresses(fetchedAddresses);
    };
    loadAddresses();
  }, []);

  const handleAddAddress = () => {
    router.push({
      pathname: '/address-form',
      params: { mode: 'add' }
    });
  };

  const handleEditAddress = (address: SavedAddress) => {
    router.push({
      pathname: '/address-form',
      params: { 
        mode: 'edit',
        addressId: address.id
      }
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Supprimer cette adresse',
      'Voulez-vous vraiment supprimer cette adresse ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteAddress(addressId);
            setAddresses(addresses.filter(addr => addr.id !== addressId));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PageTransition>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Mes adresses</ThemedText>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddAddress}
            >
              <Ionicons name="add" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {addresses.map((address) => (
              <View key={address.id} style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <View style={styles.addressIcon}>
                    <Ionicons name={address.icon} size={24} color={theme.colors.primary} />
                  </View>
                  <View style={styles.addressInfo}>
                    <ThemedText style={styles.addressLabel}>{address.label}</ThemedText>
                    <ThemedText style={styles.addressText}>{address.address}</ThemedText>
                    <View style={styles.deliveryMethodBadge}>
                      <Ionicons 
                        name={address.deliveryMethod === 'hand' ? 'hand-left' : 'location'} 
                        size={16} 
                        color={theme.colors.primary} 
                      />
                      <ThemedText style={styles.deliveryMethodText}>
                        {address.deliveryMethod === 'hand' ? 'En main propre' : 'À déposer'}
                      </ThemedText>
                    </View>
                  </View>
                </View>
                
                <View style={styles.addressActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleEditAddress(address)}
                  >
                    <Ionicons name="pencil" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteAddress(address.id)}
                  >
                    <Ionicons name="trash" size={20} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </ThemedView>
      </PageTransition>
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
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: `${theme.colors.primary}20`,
  },
  content: {
    flex: 1,
  },
  addressCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  deliveryMethodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${theme.colors.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  deliveryMethodText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: `${theme.colors.primary}20`,
  },
  deleteButton: {
    backgroundColor: `${theme.colors.error}20`,
  },
});
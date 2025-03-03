import { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar, Image, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useCart } from '@/contexts/CartContext';
import { useUI } from '@/contexts/UIContext';
import { theme } from '@/constants/theme';
import axiosInstance from '@/api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Frais de livraison par restaurant
const DELIVERY_FEES = {
  '1': 2.5,
  '2': 3.0,
  '3': 4.0,
  // Ajouter d'autres restaurants au besoin
};

// Ajoutez cette interface pour typer les données d'adresse
interface Address {
  id: string;
  address: string;
  details?: string;
  label?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  deliveryInstructions?: string;
  deliveryMethod?: string;
  deliveryOption?: string;
  icon?: string;
}

export default function OrderScreen() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { setFloatingCartVisible } = useUI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [savedMethods, setSavedMethods] = useState([]);
  const [lastAddress, setLastAddress] = useState<Address | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  
  // Grouper les articles par restaurant
  const groupedItems = items.reduce((groups, item) => {
    const restaurantId = String(item.restaurantId || 'unknown');
    if (!groups[restaurantId]) {
      groups[restaurantId] = {
        name: item.restaurantName || 'Restaurant inconnu',
        items: [],
        subtotal: 0,
        deliveryFee: DELIVERY_FEES[restaurantId] || 3.0,
        image: item.restaurantImage || 'https://via.placeholder.com/60?text=Restaurant'
      };
    }
    groups[restaurantId].items.push(item);
    groups[restaurantId].subtotal += Number(item.price) * Number(item.quantity);
    return groups;
  }, {});

  // Calculer le total avec les frais de livraison par restaurant
  const getTotalWithFees = () => {
    return Object.values(groupedItems).reduce((total, restaurant: any) => {
      return total + Number(restaurant.subtotal) + Number(restaurant.deliveryFee);
    }, 0);
  };

  useEffect(() => {
    // Masquer le panier flottant quand on entre dans l'écran
    setFloatingCartVisible(false);
    
    // Récupérer l'adresse
    fetchLastAddress();
    
    // Récupérer les méthodes de paiement
    fetchPaymentMethods();
    
    // Vérifier si une nouvelle adresse a été sélectionnée
    const checkSelectedAddress = async () => {
      const selectedAddress = await AsyncStorage.getItem('selectedAddress');
      if (selectedAddress) {
        // Mettre à jour l'adresse dans l'état
        setLastAddress({
          ...lastAddress,
          address: selectedAddress
        });
        // Effacer l'adresse stockée pour éviter de la réutiliser
        AsyncStorage.removeItem('selectedAddress');
      }
    };
    
    checkSelectedAddress();
    
    // Réactiver le panier flottant quand on quitte l'écran
    return () => setFloatingCartVisible(true);
  }, []);

  // Fonction pour récupérer la dernière adresse
  const fetchLastAddress = async () => {
    try {
      setLoadingAddress(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error('Token d\'authentification manquant');
        setLoadingAddress(false);
        return;
      }

      // Récupérer toutes les adresses avec l'endpoint correct
      const response = await axiosInstance.get('/api/addresses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Réponse API adresses:', response.data); // Ajout de log pour déboguer

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Prendre la dernière adresse de la liste
        setLastAddress(response.data[response.data.length - 1]);
      } else {
        console.log('Aucune adresse trouvée ou format de réponse incorrect');
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des adresses:', err);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Fonction pour récupérer les méthodes de paiement
  const fetchPaymentMethods = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axiosInstance.get('/api/payment-methods', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedMethods(response.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleOrderSubmit = async () => {
    // Générer un numéro de commande aléatoire
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Obtenir la date actuelle formatée
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Créer l'objet de commande avec toutes les informations nécessaires
    const orderData = {
      orderNumber,
      date: formattedDate,
      items: items,
      address: lastAddress,
      paymentMethod,
      subtotal: getTotalWithFees(),
      deliveryFees: DELIVERY_FEES,
      total: getTotalWithFees(),
      status: 'En préparation',
      deliveryInstructions,
      restaurants: Object.values(groupedItems).map(restaurant => ({
        name: restaurant.name,
        image: restaurant.image,
        subtotal: restaurant.subtotal,
        deliveryFee: restaurant.deliveryFee
      }))
    };

    // Afficher les informations complètes de la commande dans la console
    console.log('Commande complète:', JSON.stringify({
      ...orderData,
      cartContext: {
        items: items,
        total: getTotalWithFees(),
        date: formattedDate
      }
    }, null, 2));

    try {
      // Simuler une requête API
      setLoading(true);
      
      // Log détaillé avant de soumettre la commande
      console.log('Articles dans le panier:', JSON.stringify({
        items: items,
        groupedItems: groupedItems,
        total: getTotalWithFees(),
        date: formattedDate,
        orderNumber: orderNumber
      }, null, 2));
      
      // Envoyer la commande à l'API
      const token = await AsyncStorage.getItem('token');
      const response = await axiosInstance.post('/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        // Stocker la commande dans AsyncStorage pour pouvoir l'afficher dans l'historique
        const existingOrdersString = await AsyncStorage.getItem('orders');
        const existingOrders = existingOrdersString ? JSON.parse(existingOrdersString) : [];
        const updatedOrders = [orderData, ...existingOrders];
        await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
        
        // Vider le panier
        clearCart();
        
        // Rediriger vers la page d'accueil avec un paramètre pour déclencher l'animation
        router.replace({
          pathname: '/',
          params: { 
            orderSuccess: 'true',
            orderNumber: orderData.orderNumber
          }
        });
      } else {
        throw new Error('Erreur lors de la création de la commande');
      }
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      setError('Une erreur est survenue lors de la commande. Veuillez réessayer.');
      setLoading(false);
    }
  };

  const handleSelectPaymentMethod = (method: string) => {
    if (paymentMethod === method) {
      setPaymentMethod(null); // Deselect if the same method is selected again
    } else {
      setPaymentMethod(method);
    }
  };

  const handleAddressChange = () => {
    // Réactiver le panier flottant avant de naviguer
    setFloatingCartVisible(true);
    router.push('/address-selection');
  };

  const handleAddPaymentMethod = () => {
    // Réactiver le panier flottant avant de naviguer
    setFloatingCartVisible(true);
    router.push('/payment-methods');
  };

  const handleAddInstructions = () => {
    setShowInstructionsModal(false);
    // Vous pourriez vouloir sauvegarder ces instructions quelque part
    // ou les inclure dans l'objet de commande lors de la soumission
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Définir la couleur de la barre de statut uniquement pour cet écran */}
      <StatusBar style="light" />
      
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Passer Commande</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView}>
        {Object.keys(groupedItems).length === 0 ? (
          <ThemedText style={styles.emptyText}>Votre panier est vide.</ThemedText>
        ) : (
          Object.entries(groupedItems).map(([restaurantId, restaurant]: [string, any]) => (
            <ThemedView key={restaurantId} style={styles.restaurantContainer}>
              <View style={styles.restaurantHeader}>
                <Image 
                  source={{ uri: restaurant.image }} 
                  style={styles.restaurantImage} 
                />
                <View style={styles.restaurantInfo}>
                  <ThemedText style={styles.restaurantName}>{restaurant.name}</ThemedText>
                  <ThemedText style={styles.itemCount}>
                    {restaurant.items.length} {restaurant.items.length > 1 ? 'articles' : 'article'}
                  </ThemedText>
                </View>
              </View>
              
              {restaurant.items.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={styles.itemDetails}>
                    <View style={styles.itemNameRow}>
                      <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                      <ThemedText style={styles.itemQuantity}>x{item.quantity}</ThemedText>
                    </View>
                    
                    {/* Afficher les options sélectionnées s'il y en a */}
                    {item.selectedOptions && item.selectedOptions.length > 0 && (
                      <View style={styles.optionsContainer}>
                        {item.selectedOptions.map((option, optIndex) => (
                          <ThemedText key={optIndex} style={styles.optionText}>
                            {option.name}: {option.choice.name} 
                            {option.choice.price > 0 && ` (+${option.choice.price.toFixed(2)}€)`}
                          </ThemedText>
                        ))}
                      </View>
                    )}
                  </View>
                  <ThemedText style={styles.itemPrice}>{(Number(item.price) * Number(item.quantity)).toFixed(2)}€</ThemedText>
                </View>
              ))}
              
              <View style={styles.subtotalContainer}>
                <ThemedText style={styles.subtotalLabel}>Sous-total</ThemedText>
                <ThemedText style={styles.subtotalAmount}>{Number(restaurant.subtotal).toFixed(2)}€</ThemedText>
              </View>
              
              <View style={styles.deliveryFeeContainer}>
                <ThemedText style={styles.deliveryFeeLabel}>Frais de livraison</ThemedText>
                <ThemedText style={styles.deliveryFeeAmount}>{Number(restaurant.deliveryFee).toFixed(2)}€</ThemedText>
              </View>
            </ThemedView>
          ))
        )}

        {/* Adresse de livraison */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Adresse de livraison</ThemedText>
          
          {loadingAddress ? (
            <ThemedText>Chargement de l'adresse...</ThemedText>
          ) : lastAddress ? (
            <View style={styles.addressContent}>
              <Ionicons name="location-outline" size={24} color={theme.colors.text} />
              <View style={styles.addressDetails}>
                <ThemedText style={styles.addressText}>
                  {lastAddress.address}
                </ThemedText>
                {lastAddress.details && (
                  <ThemedText style={styles.addressDetailsText}>
                    {lastAddress.details}
                  </ThemedText>
                )}
                {lastAddress.deliveryInstructions && (
                  <ThemedText style={styles.addressDetailsText}>
                    Instructions: {lastAddress.deliveryInstructions}
                  </ThemedText>
                )}
              </View>
              <TouchableOpacity 
                style={styles.changeAddressButton}
                onPress={handleAddressChange}
              >
                <ThemedText style={styles.changeAddressText}>Modifier</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.addAddressButton}
              onPress={handleAddressChange}
            >
              <ThemedText style={styles.addAddressText}>Ajouter une adresse</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>

        {/* Méthode de paiement */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Méthode de paiement</ThemedText>
          
          <View style={styles.paymentMethodsContainer}>
            {savedMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodItem,
                  method.isDefault && styles.paymentMethodItemDefault,
                  paymentMethod === method.id && styles.paymentMethodItemSelected,
                ]}
                onPress={() => handleSelectPaymentMethod(method.id)}
              >
                <Ionicons name={method.icon as any} size={24} color={theme.colors.primary} />
                <View style={styles.paymentMethodDetails}>
                  <ThemedText style={styles.paymentMethodLabel}>{method.label}</ThemedText>
                  {method.isDefault && (
                    <ThemedText style={styles.defaultLabel}>Par défaut</ThemedText>
                  )}
                </View>
                {paymentMethod === method.id && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.addPaymentButton}
              onPress={handleAddPaymentMethod}
            >
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
              <ThemedText style={styles.addPaymentText}>Ajouter un moyen de paiement</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Instructions de livraison */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Instructions de livraison supplémentaires</ThemedText>
          
          <View style={styles.instructionsContainer}>
            {deliveryInstructions ? (
              <>
                <ThemedText style={styles.instructionsText}>
                  {deliveryInstructions}
                </ThemedText>
                <TouchableOpacity 
                  style={styles.editInstructionsButton}
                  onPress={() => setShowInstructionsModal(true)}
                >
                  <ThemedText style={styles.editInstructionsText}>Modifier</ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={styles.addInstructionsButton}
                onPress={() => setShowInstructionsModal(true)}
              >
                <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
                <ThemedText style={styles.addInstructionsText}>Ajouter des instructions supplémentaires</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </ThemedView>

        {/* Total */}
        <ThemedView style={styles.totalContainer}>
          <ThemedText style={styles.totalText}>Total</ThemedText>
          <ThemedText style={styles.totalAmount}>{getTotalWithFees().toFixed(2)}€</ThemedText>
        </ThemedView>

        {/* Bouton de commande */}
        <TouchableOpacity 
          style={[
            styles.orderButton,
            (!paymentMethod || !lastAddress) && styles.orderButtonDisabled
          ]}
          onPress={handleOrderSubmit}
          disabled={!paymentMethod || !lastAddress || loading}
        >
          <ThemedText style={styles.orderButtonText}>
            {loading ? 'Traitement en cours...' : 'Passer la commande'}
          </ThemedText>
        </TouchableOpacity>

        {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      </ScrollView>

      <Modal
        visible={showInstructionsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInstructionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Instructions de livraison</ThemedText>
            
            <TextInput
              style={styles.instructionsInput}
              value={deliveryInstructions}
              onChangeText={setDeliveryInstructions}
              placeholder="Ex: Sonner à l'interphone, laisser devant la porte..."
              multiline={true}
              numberOfLines={4}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowInstructionsModal(false)}
              >
                <ThemedText style={styles.cancelButtonText}>Annuler</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleAddInstructions}
              >
                <ThemedText style={styles.saveButtonText}>Enregistrer</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  restaurantContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  restaurantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  restaurantInfo: {
    marginLeft: 16,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  itemDetails: {
    flex: 1,
    marginRight: 8,
  },
  itemNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 16,
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 8,
  },
  optionsContainer: {
    marginTop: 4,
  },
  optionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  subtotalLabel: {
    fontSize: 16,
  },
  subtotalAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  deliveryFeeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  deliveryFeeLabel: {
    fontSize: 16,
  },
  deliveryFeeAmount: {
    fontSize: 16,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressDetails: {
    flex: 1,
    marginLeft: 16,
  },
  addressText: {
    fontSize: 16,
  },
  addressSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  changeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 4,
  },
  changeButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addAddressText: {
    marginLeft: 12,
    color: theme.colors.primary,
    fontSize: 16,
  },
  paymentMethodsContainer: {
    marginTop: 8,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentMethodItemDefault: {
    borderColor: theme.colors.primary + '60',
  },
  paymentMethodItemSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  paymentMethodDetails: {
    flex: 1,
    marginLeft: 16,
  },
  paymentMethodLabel: {
    fontSize: 16,
  },
  defaultLabel: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 4,
  },
  addPaymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    borderStyle: 'dashed',
  },
  addPaymentText: {
    marginLeft: 12,
    color: theme.colors.primary,
    fontSize: 16,
  },
  instructionsContainer: {
    marginTop: 8,
  },
  instructionsText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  editInstructionsButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#FFE5B940',
    borderRadius: 16,
  },
  editInstructionsText: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  addInstructionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFE5B920',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE5B9',
    borderStyle: 'dashed',
  },
  addInstructionsText: {
    marginLeft: 12,
    color: theme.colors.primary,
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: 24,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  orderButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  orderButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.7,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressDetails: {
    flex: 1,
    marginLeft: 16,
  },
  addressText: {
    fontSize: 16,
  },
  addressDetailsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  changeAddressButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 4,
  },
  changeAddressText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  cancelButtonText: {
    color: theme.colors.textSecondary,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
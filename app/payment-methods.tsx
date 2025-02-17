import { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, SafeAreaView, Platform, StatusBar, Alert, Modal, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';

type PaymentMethod = 'card' | 'paypal' | 'googlepay' | 'applepay';

const PAYMENT_METHODS = [
  {
    id: 'card' as const,
    label: 'Ajouter une carte bancaire',
    description: 'Visa, Mastercard, CB',
    icon: 'card-outline',
  },
  {
    id: 'paypal' as const,
    label: 'Connecter PayPal',
    description: 'Associer votre compte PayPal',
    icon: 'logo-paypal',
  },
  {
    id: 'googlepay' as const,
    label: 'Connecter Google Pay',
    description: 'Associer votre compte Google Pay',
    icon: 'logo-google',
  },
  Platform.OS === 'ios' ? {
    id: 'applepay' as const,
    label: 'Connecter Apple Pay',
    description: 'Associer votre compte Apple Pay',
    icon: 'logo-apple',
  } : null,
].filter(Boolean);

const SAVED_METHODS = [
  {
    id: '1',
    type: 'card',
    label: 'Visa se terminant par 4242',
    icon: 'card-outline',
    isDefault: true,
  },
  {
    id: '2',
    type: 'paypal',
    label: 'PayPal - john.doe@gmail.com',
    icon: 'logo-paypal',
    isDefault: false,
  }
];

const OptionsModal = ({ 
  visible, 
  onClose, 
  method, 
  onToggleDefault, 
  onDelete 
}: { 
  visible: boolean;
  onClose: () => void;
  method: (typeof SAVED_METHODS)[0] | null;
  onToggleDefault: () => void;
  onDelete: () => void;
}) => {
  if (!method) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>{method.label}</ThemedText>
          
          <TouchableOpacity 
            style={styles.modalOption}
            onPress={() => {
              onToggleDefault();
              onClose();
            }}
          >
            <Ionicons 
              name={method.isDefault ? 'star' : 'star-outline'} 
              size={24} 
              color={theme.colors.text} 
            />
            <ThemedText style={styles.modalOptionText}>
              {method.isDefault ? 'Retirer par défaut' : 'Définir par défaut'}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.modalOption, styles.deleteOption]}
            onPress={() => {
              onClose();
              Alert.alert(
                'Confirmation',
                'Voulez-vous vraiment supprimer ce moyen de paiement ?',
                [
                  {
                    text: 'Annuler',
                    style: 'cancel',
                  },
                  {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: onDelete,
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
            <ThemedText style={[styles.modalOptionText, styles.deleteText]}>
              Supprimer
            </ThemedText>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [savedMethods, setSavedMethods] = useState(SAVED_METHODS);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<(typeof SAVED_METHODS)[0] | null>(null);

  useEffect(() => {
    if (params.newMethod) {
      const newMethod = JSON.parse(params.newMethod as string);
      setSavedMethods(prev => [...prev, newMethod]);
    }
  }, [params.newMethod]);

  const handleAddMethod = (method: PaymentMethod) => {
    if (method === 'card') {
      router.push('/card-form');
    } else {
      router.push({
        pathname: '/payment-connect',
        params: { method }
      });
    }
  };

  const handleOptionsPress = (method: (typeof SAVED_METHODS)[0]) => {
    setSelectedMethod(method);
    setModalVisible(true);
  };

  const handleToggleDefault = (methodId: string) => {
    setSavedMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === methodId ? !method.isDefault : false
      }))
    );
  };

  const handleDelete = (methodId: string) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer ce moyen de paiement ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setSavedMethods(methods => 
              methods.filter(method => method.id !== methodId)
            );
          },
        },
      ]
    );
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>Moyens de paiement</ThemedText>
          </View>

          <ScrollView style={styles.content}>
            {savedMethods.length > 0 && (
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Moyens de paiement enregistrés</ThemedText>
                {savedMethods.map((method) => (
                  <View key={method.id} style={styles.savedMethod}>
                    <View style={styles.savedMethodInfo}>
                      <View style={styles.paymentIconContainer}>
                        <Ionicons name={method.icon} size={24} color={theme.colors.text} />
                      </View>
                      <View style={styles.savedMethodDetails}>
                        <ThemedText style={styles.savedMethodLabel}>{method.label}</ThemedText>
                        {method.isDefault && (
                          <ThemedText style={styles.defaultBadge}>Par défaut</ThemedText>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => handleOptionsPress(method)}
                      style={styles.optionsButton}
                    >
                      <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.text} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Ajouter un moyen de paiement</ThemedText>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={styles.paymentOption}
                  onPress={() => handleAddMethod(method.id)}
                >
                  <View style={styles.paymentIconContainer}>
                    <Ionicons 
                      name={method.icon}
                      size={24}
                      color={theme.colors.text}
                    />
                  </View>
                  <View style={styles.paymentDetails}>
                    <ThemedText style={styles.paymentLabel}>
                      {method.label}
                    </ThemedText>
                    <ThemedText style={styles.paymentDescription}>
                      {method.description}
                    </ThemedText>
                  </View>
                  <Ionicons 
                    name="chevron-forward"
                    size={24}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
      <OptionsModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        method={selectedMethod}
        onToggleDefault={() => selectedMethod && handleToggleDefault(selectedMethod.id)}
        onDelete={() => selectedMethod && handleDelete(selectedMethod.id)}
      />
    </>
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
  },
  section: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
  },
  savedMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  savedMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  savedMethodDetails: {
    marginLeft: theme.spacing.md,
  },
  savedMethodLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  defaultBadge: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 2,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.background}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentDetails: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  optionsButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: theme.spacing.md,
  },
  deleteOption: {
    backgroundColor: `${theme.colors.error}10`,
  },
  deleteText: {
    color: theme.colors.error,
  },
}); 
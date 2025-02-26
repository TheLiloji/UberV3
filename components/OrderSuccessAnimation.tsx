import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, StyleSheet, Animated, Easing, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { theme } from '@/constants/theme';
import LottieView from 'lottie-react-native';
import * as Notifications from 'expo-notifications';
import { useSettings } from '@/contexts/SettingsContext';

// Configurer les notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface OrderSuccessAnimationProps {
  visible: boolean;
  orderNumber: string;
  onClose: () => void;
}

export const OrderSuccessAnimation = ({ visible, orderNumber, onClose }: OrderSuccessAnimationProps) => {
  const { notificationsEnabled } = useSettings();
  const [animationStep, setAnimationStep] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const successAnimationRef = useRef<LottieView>(null);
  const cookingAnimationRef = useRef<LottieView>(null);
  const [notificationsSent, setNotificationsSent] = useState({
    validated: false,
    cooking: false
  });
  
  // Référence pour suivre si le composant est monté
  const isMounted = useRef(true);
  
  // Référence pour les timers
  const timers = useRef<NodeJS.Timeout[]>([]);
  
  // Nettoyer les timers
  const clearAllTimers = () => {
    timers.current.forEach(timer => clearTimeout(timer));
    timers.current = [];
  };
  
  // Fonction pour gérer la fermeture proprement
  const handleClose = () => {
    // Nettoyer les timers
    clearAllTimers();
    
    // Animation de sortie
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (isMounted.current) {
        // Réinitialiser l'état
        setAnimationStep(0);
        // Appeler la fonction de fermeture du parent
        onClose();
      }
    });
  };
  
  // Demander les permissions de notification
  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        await Notifications.requestPermissionsAsync();
      }
    })();
    
    // Nettoyer lors du démontage
    return () => {
      isMounted.current = false;
      clearAllTimers();
    };
  }, []);

  // Fonction pour envoyer une notification
  const sendNotification = async (title: string, body: string, type: 'validated' | 'cooking') => {
    try {
      // Vérifier si les notifications sont activées dans les paramètres
      if (!notificationsEnabled) {
        console.log('Notifications désactivées dans les paramètres, notification ignorée');
        return;
      }
      
      // Vérifier si cette notification a déjà été envoyée
      if (notificationsSent[type]) {
        console.log(`Notification "${type}" déjà envoyée, ignorée`);
        return;
      }
      
      if ((Platform.OS === 'android' || Platform.OS === 'ios') && isMounted.current) {
        console.log("Envoi de notification:", title);
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: { orderNumber },
          },
          trigger: null, // Immédiatement
        });
        console.log("Notification envoyée avec succès");
        
        // Marquer cette notification comme envoyée
        if (isMounted.current) {
          setNotificationsSent(prev => ({
            ...prev,
            [type]: true
          }));
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la notification:", error);
    }
  };

  useEffect(() => {
    // Nettoyer les timers existants
    clearAllTimers();
    
    if (visible) {
      // Réinitialiser l'état des notifications à chaque nouvelle ouverture
      setNotificationsSent({
        validated: false,
        cooking: false
      });
      
      // Animation d'entrée
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.elastic(1),
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Jouer l'animation de succès
      if (successAnimationRef.current) {
        successAnimationRef.current.play();
      }

      // Séquence d'animations et notifications
      const timer1 = setTimeout(async () => {
        if (isMounted.current) {
          setAnimationStep(1); // Commande validée
          await sendNotification(
            "Commande validée ✅", 
            `Votre commande #${orderNumber} a été validée par l'établissement.`,
            'validated'
          );
        }
      }, 3000);
      timers.current.push(timer1);

      const timer2 = setTimeout(async () => {
        if (isMounted.current) {
          setAnimationStep(2); // En cours de préparation
          if (cookingAnimationRef.current) {
            cookingAnimationRef.current.play(0, 100); // Jouer une seule fois de 0 à 100%
          }
          await sendNotification(
            "En préparation 👨‍🍳", 
            `Votre commande #${orderNumber} est en cours de préparation.`,
            'cooking'
          );
        }
      }, 10000);
      timers.current.push(timer2);

      const timer3 = setTimeout(() => {
        if (isMounted.current) {
          handleClose();
        }
      }, 15000);
      timers.current.push(timer3);
    }
    
    return () => {
      // Nettoyer les timers lors du changement de dépendances
      clearAllTimers();
    };
  }, [visible, orderNumber]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.content,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleClose}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          {animationStep === 0 && (
            <>
              <View style={styles.animationContainer}>
                <LottieView
                  ref={successAnimationRef}
                  source={require('@/assets/animations/order-success.json')}
                  autoPlay
                  loop={false}
                  style={styles.animation}
                />
              </View>
              <ThemedText style={styles.title}>Commande envoyée !</ThemedText>
              <ThemedText style={styles.orderNumber}>Commande #{orderNumber}</ThemedText>
              <ThemedText style={styles.message}>
                Votre commande a été envoyée aux restaurants.
              </ThemedText>
            </>
          )}

          {animationStep === 1 && (
            <>
              <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
              </View>
              <ThemedText style={styles.title}>Commande validée</ThemedText>
              <ThemedText style={styles.message}>
                Votre commande a été validée par l'établissement.
              </ThemedText>
            </>
          )}

          {animationStep === 2 && (
            <>
              <View style={styles.animationContainer}>
                <LottieView
                  ref={cookingAnimationRef}
                  source={require('@/assets/animations/cooking.json')}
                  autoPlay
                  loop={false}
                  style={styles.animation}
                  speed={0.7} // Ralentir l'animation pour qu'elle dure plus longtemps
                />
              </View>
              <ThemedText style={styles.title}>En préparation</ThemedText>
              <ThemedText style={styles.message}>
                Votre commande est en cours de préparation.
              </ThemedText>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const contentWidth = Math.min(width * 0.85, 400);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 24,
    paddingTop: 30,
    alignItems: 'center',
    width: contentWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    marginBottom: 24,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    width: '100%',
    paddingTop: 8,
    lineHeight: 34,
  },
  orderNumber: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    paddingTop: 4,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
}); 
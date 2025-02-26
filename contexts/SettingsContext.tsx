import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

interface SettingsContextType {
  notificationsEnabled: boolean;
  locationEnabled: boolean;
  language: string;
  toggleNotifications: () => Promise<void>;
  toggleLocation: () => Promise<void>;
  setLanguage: (language: string) => Promise<void>;
  isLocationPermissionGranted: () => Promise<boolean>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [language, setLanguageState] = useState('Français');

  // Charger les paramètres depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('appSettings');
        if (storedSettings) {
          const settings = JSON.parse(storedSettings);
          setNotificationsEnabled(settings.notificationsEnabled ?? true);
          setLocationEnabled(settings.locationEnabled ?? true);
          setLanguageState(settings.language ?? 'Français');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      }
    };

    loadSettings();
  }, []);

  // Sauvegarder les paramètres dans AsyncStorage à chaque changement
  const saveSettings = async () => {
    try {
      const settings = {
        notificationsEnabled,
        locationEnabled,
        language,
      };
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  };

  useEffect(() => {
    saveSettings();
  }, [notificationsEnabled, locationEnabled, language]);

  // Gérer les notifications
  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    
    if (newValue) {
      // Activer les notifications
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Vous devez autoriser les notifications dans les paramètres de votre appareil.');
        return;
      }
    }
    
    setNotificationsEnabled(newValue);
  };

  // Gérer la localisation
  const toggleLocation = async () => {
    const newValue = !locationEnabled;
    
    if (newValue) {
      // Activer la localisation
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Vous devez autoriser la localisation dans les paramètres de votre appareil.');
        return;
      }
    }
    
    setLocationEnabled(newValue);
  };

  // Changer la langue
  const setLanguage = async (newLanguage: string) => {
    setLanguageState(newLanguage);
  };

  // Vérifier si la permission de localisation est accordée
  const isLocationPermissionGranted = async () => {
    if (!locationEnabled) return false;
    
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  };

  return (
    <SettingsContext.Provider
      value={{
        notificationsEnabled,
        locationEnabled,
        language,
        toggleNotifications,
        toggleLocation,
        setLanguage,
        isLocationPermissionGranted,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 
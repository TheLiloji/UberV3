import { useSettings } from '@/contexts/SettingsContext';
import fr from '@/locales/fr';
import en from '@/locales/en';

// Type pour les clés de traduction
type NestedKeys<T> = T extends object
  ? { [K in keyof T]: K extends string ? `${K}` | `${K}.${NestedKeys<T[K]>}` : never }[keyof T]
  : never;

type TranslationKeys = NestedKeys<typeof fr>;

// Fonction pour obtenir une valeur à partir d'un chemin de clé (ex: "home.title")
const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split('.');
  return keys.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj) || path;
};

export const useTranslation = () => {
  const { language } = useSettings();
  
  // Sélectionner le dictionnaire de traduction en fonction de la langue
  const dictionary = language === 'English' ? en : fr;
  
  // Fonction de traduction
  const t = (key: TranslationKeys, params?: Record<string, string | number>): string => {
    let translation = getNestedValue(dictionary, key);
    
    // Remplacer les paramètres dans la traduction
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    
    return translation;
  };
  
  return { t };
}; 
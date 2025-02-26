import { StyleSheet, TouchableOpacity, Switch, ScrollView, View, SafeAreaView, Platform, StatusBar, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';
import { useSettings } from '@/contexts/SettingsContext';
import { useTranslation } from '@/hooks/useTranslation';

interface SettingOption {
  id: string;
  label: string;
  icon: any;
  type: 'toggle' | 'select' | 'screen';
  value?: any;
  screen?: string;
}

const SETTINGS_OPTIONS = [
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'notifications-outline',
    value: true,
  },
  {
    id: 'language',
    label: 'Langue',
    icon: 'language-outline',
    value: 'Français',
  },
  {
    id: 'location',
    label: 'Localisation',
    icon: 'location-outline',
    value: 'Activée',
  },
  {
    id: 'privacy',
    label: 'Confidentialité',
    icon: 'shield-checkmark-outline',
    screen: 'privacy',
  },
  {
    id: 'about',
    label: 'À propos',
    icon: 'information-circle-outline',
    screen: 'about',
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { 
    notificationsEnabled, 
    locationEnabled, 
    language, 
    toggleNotifications, 
    toggleLocation, 
    setLanguage 
  } = useSettings();
  
  const [settings, setSettings] = useState<SettingOption[]>([
    {
      id: 'notifications',
      label: 'Notifications',
      icon: 'notifications-outline',
      value: notificationsEnabled,
      type: 'toggle'
    },
    {
      id: 'language',
      label: 'Langue',
      icon: 'language-outline',
      value: language,
      type: 'select'
    },
    {
      id: 'location',
      label: 'Localisation',
      icon: 'location-outline',
      value: locationEnabled,
      type: 'toggle'
    },
    {
      id: 'privacy',
      label: 'Confidentialité',
      icon: 'shield-checkmark-outline',
      type: 'screen',
      screen: '/privacy'
    },
    {
      id: 'about',
      label: 'À propos',
      icon: 'information-circle-outline',
      type: 'screen',
      screen: '/about'
    }
  ]);

  useEffect(() => {
    setSettings(prevSettings => 
      prevSettings.map(setting => {
        if (setting.id === 'notifications') {
          return { ...setting, value: notificationsEnabled };
        }
        if (setting.id === 'language') {
          return { ...setting, value: language };
        }
        if (setting.id === 'location') {
          return { ...setting, value: locationEnabled };
        }
        return setting;
      })
    );
  }, [notificationsEnabled, locationEnabled, language]);

  const handleSettingPress = async (setting: SettingOption) => {
    switch (setting.type) {
      case 'toggle':
        if (setting.id === 'notifications') {
          await toggleNotifications();
        } else if (setting.id === 'location') {
          await toggleLocation();
        }
        break;
      case 'select':
        if (setting.id === 'language') {
          Alert.alert(
            t('settings.selectLanguage'),
            '',
            [
              { text: 'Français', onPress: () => setLanguage('Français') },
              { text: 'English', onPress: () => setLanguage('English') },
              { text: t('common.cancel'), style: 'cancel' }
            ]
          );
        }
        break;
      case 'screen':
        if (setting.screen) {
          router.push(setting.screen);
        }
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>{t('settings.title')}</ThemedText>
        </ThemedView>

        {/* Settings List */}
        <ScrollView style={styles.scrollContent}>
          {settings.map((setting) => (
            <TouchableOpacity
              key={setting.id}
              style={styles.settingItem}
              onPress={() => handleSettingPress(setting)}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons name={setting.icon} size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <ThemedText style={styles.settingTitle}>
                  {t(`settings.${setting.id}`)}
                </ThemedText>
                <ThemedText style={styles.settingValue}>
                  {typeof setting.value === 'boolean' 
                    ? (setting.value ? t('settings.enabled') : t('settings.disabled'))
                    : setting.value}
                </ThemedText>
              </View>
              {setting.type === 'toggle' && (
                <Switch
                  value={setting.value}
                  onValueChange={() => handleSettingPress(setting)}
                  trackColor={{ false: '#767577', true: `${theme.colors.primary}80` }}
                  thumbColor={setting.value ? theme.colors.primary : '#f4f3f4'}
                />
              )}
              {setting.type === 'screen' && (
                <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
              )}
              {setting.type === 'select' && (
                <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${theme.colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
}); 
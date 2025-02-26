import { StyleSheet, TouchableOpacity, ScrollView, View, SafeAreaView, Platform, StatusBar, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useEffect } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';
import { useUI } from '@/contexts/UIContext';

export default function PrivacyScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setFloatingCartVisible } = useUI();

  // Masquer le panier flottant lorsque cette page est affichée
  useEffect(() => {
    setFloatingCartVisible(false);
    
    // Réafficher le panier flottant lorsque l'utilisateur quitte cette page
    return () => {
      setFloatingCartVisible(true);
    };
  }, []);

  const openGitHub = () => {
    Linking.openURL('https://github.com/TheLiloji/UberV3');
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
          <ThemedText type="title" style={styles.headerTitle}>{t('privacy.title')}</ThemedText>
        </ThemedView>

        {/* Content */}
        <ScrollView style={styles.scrollContent}>
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('privacy.commitment')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('privacy.commitmentText')}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('privacy.codeTransparency')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('privacy.codeTransparencyText')}
            </ThemedText>
            <TouchableOpacity 
              style={styles.githubButton}
              onPress={openGitHub}
            >
              <Ionicons name="logo-github" size={24} color="#fff" />
              <ThemedText style={styles.githubButtonText}>{t('privacy.verifyCode')}</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('privacy.dataCollection')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('privacy.dataCollectionCustom')}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('privacy.dataUsage')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('privacy.dataUsageCustom')}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('privacy.dataSharing')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('privacy.dataSharingCustom')}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('privacy.noTrackers')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('privacy.noTrackersText')}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('privacy.dataControl')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('privacy.dataControlText')}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('privacy.security')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('privacy.securityText')}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('privacy.contact')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('privacy.contactText')}
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
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
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  githubButton: {
    backgroundColor: '#24292e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: 8,
    marginVertical: theme.spacing.sm,
  },
  githubButtonText: {
    color: '#fff',
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  },
}); 
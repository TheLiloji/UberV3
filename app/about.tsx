import { StyleSheet, TouchableOpacity, ScrollView, View, SafeAreaView, Platform, StatusBar, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/hooks/useTranslation';
import { useEffect } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';
import { useUI } from '@/contexts/UIContext';

export default function AboutScreen() {
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
          <ThemedText type="title" style={styles.headerTitle}>{t('about.title')}</ThemedText>
        </ThemedView>

        {/* Content */}
        <ScrollView style={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://i.imgur.com/XVd98gk.png' }}
              style={styles.logo} 
              resizeMode="contain"
            />
            <View style={styles.titleWrapper}>
              <ThemedText style={styles.appName}>Open Eat</ThemedText>
              <ThemedText style={styles.sourceText}>SOURCE</ThemedText>
            </View>
            <View style={styles.orangeLine} />
            <ThemedText style={styles.version}>Version 1.0.0</ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('about.ourMission')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('about.missionCustom')}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('about.openSource')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('about.openSourceText')}
            </ThemedText>
            <TouchableOpacity 
              style={styles.githubButton}
              onPress={openGitHub}
            >
              <Ionicons name="logo-github" size={24} color="#fff" />
              <ThemedText style={styles.githubButtonText}>{t('about.viewOnGitHub')}</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('about.privacy')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('about.privacyText')}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('about.contactUs')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('about.contactText')}
            </ThemedText>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={24} color={theme.colors.primary} />
              <ThemedText style={styles.contactText}>{t('about.contactEmail')}</ThemedText>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="logo-github" size={24} color={theme.colors.primary} />
              <ThemedText style={styles.contactText}>{t('about.contactGitHub')}</ThemedText>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('about.followUs')}</ThemedText>
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-github" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-twitter" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-linkedin" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{t('about.licence')}</ThemedText>
            <ThemedText style={styles.paragraph}>
              {t('about.licenceText')}
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
  logoContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
    paddingTop: 10,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.md,
  },
  titleWrapper: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    letterSpacing: 2,
    textAlign: 'center',
    width: '100%',
    paddingTop: 10,
    lineHeight: 40,
  },
  sourceText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    letterSpacing: 6,
    marginTop: 5,
    textAlign: 'center',
    paddingTop: 5,
    lineHeight: 24,
  },
  orangeLine: {
    height: 4,
    width: 100,
    backgroundColor: theme.colors.primary,
    marginTop: 15,
    borderRadius: 2,
  },
  version: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  contactText: {
    fontSize: 16,
    marginLeft: theme.spacing.sm,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${theme.colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
}); 
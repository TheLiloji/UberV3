import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';
import { useUI } from '@/contexts/UIContext';
import { PageTransition } from '@/components/PageTransition';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setFloatingCartVisible } = useUI();

  const handleLogin = () => {
    if (email === 'test' && password === 'test') {
      // Rediriger vers la sélection d'adresse après connexion
      router.replace('/address-selection');
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <PageTransition>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <ThemedText style={styles.title}>Connexion</ThemedText>
            
            <TouchableOpacity 
              style={styles.devButton}
              onPress={() => router.replace('/')}
            >
              <ThemedText style={styles.devButtonText}>
                Mode Dev - Passer la connexion
              </ThemedText>
            </TouchableOpacity>
            
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Email</ThemedText>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Votre email"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Mot de passe</ThemedText>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Votre mot de passe"
                  secureTextEntry
                />
              </View>

              {error ? (
                <ThemedText style={styles.errorText}>{error}</ThemedText>
              ) : null}

              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <ThemedText style={styles.loginButtonText}>Se connecter</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.registerButton}
                onPress={() => router.push('/register')}
              >
                <ThemedText style={styles.registerButtonText}>
                  Pas encore de compte ? S'inscrire
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ThemedView>
    </PageTransition>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xl,
    paddingTop: 40,
  },
  form: {
    gap: theme.spacing.md,
  },
  inputContainer: {
    gap: theme.spacing.xs,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  errorText: {
    color: 'red',
    marginTop: theme.spacing.xs,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  registerButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  devButton: {
    backgroundColor: '#FF000020',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#FF000040',
  },
  devButtonText: {
    color: '#FF0000',
    fontSize: 14,
    fontWeight: '500',
  },
}); 
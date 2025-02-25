import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, TextInput, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance from '@/api/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

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

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
        console.log("Login successful");
        // Redirect to address selection after login
        router.replace('/address-selection');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError(`Erreur lors de la connexion: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://i.imgur.com/XVd98gk.png' }}
            style={styles.logo}
          />
          <ThemedText style={styles.appName}>Open Eat</ThemedText>
          <ThemedText style={styles.sourceText}>Source</ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email ou Téléphone"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Mot de passe"
              placeholderTextColor="#999"
              secureTextEntry
            />
          </View>

          {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <ThemedText style={styles.loginButtonText}>Se connecter</ThemedText>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText style={styles.dividerText}>ou</ThemedText>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push('/register')}
          >
            <ThemedText style={styles.registerButtonText}>Créer un compte</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.devButton}
            onPress={() => router.replace('/')}
          >
            <ThemedText style={styles.devButtonText}>
              Mode Dev - Passer la connexion
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8EE',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
    paddingTop: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40,
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 10,
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 5,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 50,
  },
  sourceText: {
    fontSize: 24,
    color: theme.colors.primary,
    letterSpacing: 8,
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 30,
    fontWeight: '900',
  },
  form: {
    gap: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md + 4,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 25,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 20,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: '#666',
  },
  registerButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md + 4,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 25,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  registerButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: 20,
  },
  devButton: {
    marginTop: theme.spacing.md,
    backgroundColor: '#FF000020',
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF000040',
  },
  devButtonText: {
    color: '#FF0000',
    fontSize: 14,
    fontWeight: '500',
  },
});
import { StyleSheet, TouchableOpacity, View, ScrollView, Image, TextInput, Alert, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import axiosInstance from '@/api/axiosInstance'; // Import the Axios instance
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/constants/theme';
import { User, USER_DATA } from '@/constants/user';
import { useUI } from '@/contexts/UIContext';

const fetchUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axiosInstance.get('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

const updateUserProfile = async (profile) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', {
      uri: profile.avatar,
      name: 'avatar.png',
      type: 'image/png',
    });
    formData.append('firstName', profile.firstName);
    formData.append('lastName', profile.lastName);

    const response = await axiosInstance.put('/api/auth/account', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};

export default function AccountScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<User>(USER_DATA);
  const [editedProfile, setEditedProfile] = useState<User>(USER_DATA);
  const { setFloatingCartVisible } = useUI();

  useEffect(() => {
    setFloatingCartVisible(false);
    const loadUserProfile = async () => {
      const userProfile = await fetchUserProfile();
      if (userProfile) {
        setProfile(userProfile);
        setEditedProfile(userProfile);
      }
    };
    loadUserProfile();
    return () => setFloatingCartVisible(true);
  }, []);

  const handleSave = async () => {
    // Ici, vous pourriez ajouter une validation des données
    if (!editedProfile.email.includes('@')) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }
    
    // Dans une vraie application, vous enverriez ces données à votre API
    const updatedProfile = await updateUserProfile(editedProfile);
    if (updatedProfile) {
      setProfile(updatedProfile);
      setIsEditing(false);
    }
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie pour changer votre photo');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEditedProfile(prev => ({
        ...prev,
        avatar: result.assets[0].uri
      }));
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
          <ThemedText type="title" style={styles.headerTitle}>Mon Profil</ThemedText>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            <ThemedText style={styles.editButtonText}>
              {isEditing ? 'Enregistrer' : 'Modifier'}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ScrollView style={styles.content}>
          {/* Photo de profil */}
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: isEditing ? editedProfile.avatar : profile.avatar }} 
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity 
                style={styles.changePhotoButton}
                onPress={handleImagePick}
              >
                <Ionicons name="camera" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>

          {/* Sections */}
          <View style={styles.sectionsContainer}>
            {/* Informations personnelles */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Informations personnelles</ThemedText>
              
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Prénom</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editedProfile.firstName}
                    onChangeText={(text) => setEditedProfile({...editedProfile, firstName: text})}
                    placeholder="Prénom"
                  />
                ) : (
                  <ThemedText style={styles.value}>{profile.firstName}</ThemedText>
                )}
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Nom</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editedProfile.lastName}
                    onChangeText={(text) => setEditedProfile({...editedProfile, lastName: text})}
                    placeholder="Nom"
                  />
                ) : (
                  <ThemedText style={styles.value}>{profile.lastName}</ThemedText>
                )}
              </View>
            </View>

            {/* Coordonnées */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Coordonnées</ThemedText>
              
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editedProfile.email}
                    onChangeText={(text) => setEditedProfile({...editedProfile, email: text})}
                    placeholder="Email"
                    keyboardType="email-address"
                  />
                ) : (
                  <ThemedText style={styles.value}>{profile.email}</ThemedText>
                )}
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Téléphone</ThemedText>
                {isEditing ? (
                  <TextInput
                    style={styles.input}
                    value={editedProfile.phone}
                    onChangeText={(text) => setEditedProfile({...editedProfile, phone: text})}
                    placeholder="Téléphone"
                    keyboardType="phone-pad"
                  />
                ) : (
                  <ThemedText style={styles.value}>{profile.phone}</ThemedText>
                )}
              </View>
            </View>
          </View>

          {/* Bouton de déconnexion */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => {
              router.replace('/login');
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF4444" />
            <ThemedText style={styles.logoutText}>Se déconnecter</ThemedText>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  editButton: {
    padding: theme.spacing.xs,
  },
  editButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: 20,
  },
  sectionsContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary,
  },
  inputGroup: {
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  value: {
    fontSize: 15,
    paddingVertical: theme.spacing.xs,
  },
  input: {
    fontSize: 15,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: '#FFE5E5',
    borderRadius: theme.borderRadius.md,
  },
  logoutText: {
    color: '#FF4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
});
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image, Animated, Easing } from 'react-native';
import { ThemedText } from './ThemedText';
import { theme } from '@/constants/theme';

interface CustomSplashProps {
  onAnimationComplete: () => void;
}

export function CustomSplash({ onAnimationComplete }: CustomSplashProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const lineWidthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Première phase : rotation et apparition du logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }),
      ]),
      // Deuxième phase : apparition du texte
      Animated.parallel([
        Animated.timing(textFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(lineWidthAnim, {
          toValue: 100,
          duration: 600,
          useNativeDriver: false,
          easing: Easing.out(Easing.cubic),
        }),
      ]),
      Animated.delay(800),
      // Animation de sortie
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 3,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onAnimationComplete();
    });
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.logoContainer, 
            { 
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate: spin },
              ]
            }
          ]}
        >
          <Image
            source={{ uri: 'https://i.imgur.com/XVd98gk.png' }}
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.textContainer,
            {
              transform: [{ translateX: slideAnim }],
              opacity: textFadeAnim,
            }
          ]}
        >
          <ThemedText style={styles.mainText}>Open Eat</ThemedText>
          <ThemedText style={styles.sourceText}>SOURCE</ThemedText>
          <Animated.View 
            style={[
              styles.line,
              { width: lineWidthAnim }
            ]} 
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe4b9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
  },
  mainText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'SpaceMono',
    letterSpacing: 2,
    paddingTop: 20,
  },
  sourceText: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.primary,
    letterSpacing: 8,
    marginTop: 5,
  },
  line: {
    height: 4,
    backgroundColor: theme.colors.primary,
    marginTop: 15,
    borderRadius: 2,
  }
}); 
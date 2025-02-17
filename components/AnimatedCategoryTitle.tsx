import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { theme } from '@/constants/theme';

interface AnimatedCategoryTitleProps {
  title: string;
  subtitle?: string;
}

export function AnimatedCategoryTitle({ title, subtitle }: AnimatedCategoryTitleProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const lineWidthAnim = useRef(new Animated.Value(0)).current;
  const subtitleFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(lineWidthAnim, {
        toValue: 100,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(subtitleFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [title]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        <ThemedText style={styles.title}>{title}</ThemedText>
        {subtitle && (
          <Animated.View style={{ opacity: subtitleFadeAnim }}>
            <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          </Animated.View>
        )}
        <Animated.View 
          style={[
            styles.line,
            { width: lineWidthAnim }
          ]} 
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 0,
  },
  titleContainer: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 0,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    includeFontPadding: false,
    fontFamily: 'SpaceMono',
    letterSpacing: 3,
    marginBottom: theme.spacing.xs,
    lineHeight: 48,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    opacity: 0.9,
    letterSpacing: 1,
  },
  line: {
    height: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  categoryHeaderOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
}); 
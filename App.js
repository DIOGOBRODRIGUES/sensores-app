import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { LinearGradient } from 'expo-linear-gradient';

// Define a taxa de atualização (intervalo em ms)
const _interval = 100;
let subscription = null;

export default function App() {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const animatedValue = useState(new Animated.Value(0))[0];
  
  // Função para subscrever aos eventos do acelerômetro
  const _subscribe = () => {
    subscription = 
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
        // Animação sutil baseada no movimento
        Animated.timing(animatedValue, {
          toValue: Math.abs(accelerometerData.x + accelerometerData.y + accelerometerData.z) / 3,
          duration: 300,
          useNativeDriver: true
        }).start();
      });
    Accelerometer.setUpdateInterval(_interval);
  };

  // Função para cancelar a subscrição
  const _unsubscribe = () => {
    subscription && subscription.remove();
    subscription = null;
  };

  useEffect(() => {
    _subscribe();
    // Limpa a subscrição quando o componente é desmontado
    return () => _unsubscribe();
  }, []);

  // Calcula a cor baseada nos valores do acelerômetro
  const dynamicColor = () => {
    const magnitude = Math.sqrt(data.x**2 + data.y**2 + data.z**2);
    const hue = Math.floor((magnitude * 30) % 360);
    return `hsl(${hue}, 80%, 65%)`;
  };

  // Animação sutil com base na aceleração total
  const scale = animatedValue.interpolate({
    inputRange: [0, 2],
    outputRange: [1, 1.05],
    extrapolate: 'clamp',
  });

  return (
    <LinearGradient
      colors={['#1a2a6c', '#2a377c', '#4a5683']}
      style={styles.container}
    >
      <Text style={styles.title}>Acelerômetro</Text>
      
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.valueContainer}>
          <Text style={styles.label}>X</Text>
          <View style={styles.valueWrapper}>
            <Text style={styles.value}>{data.x.toFixed(3)}</Text>
            <View 
              style={[
                styles.bar, 
                { width: `${Math.min(Math.abs(data.x) * 100, 100)}%`, 
                  backgroundColor: data.x > 0 ? '#4CAF50' : '#FF5722' 
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.valueContainer}>
          <Text style={styles.label}>Y</Text>
          <View style={styles.valueWrapper}>
            <Text style={styles.value}>{data.y.toFixed(3)}</Text>
            <View 
              style={[
                styles.bar, 
                { width: `${Math.min(Math.abs(data.y) * 100, 100)}%`, 
                  backgroundColor: data.y > 0 ? '#2196F3' : '#9C27B0' 
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.valueContainer}>
          <Text style={styles.label}>Z</Text>
          <View style={styles.valueWrapper}>
            <Text style={styles.value}>{data.z.toFixed(3)}</Text>
            <View 
              style={[
                styles.bar, 
                { width: `${Math.min(Math.abs(data.z) * 100, 100)}%`, 
                  backgroundColor: data.z > 0 ? '#FFC107' : '#E91E63' 
                }
              ]} 
            />
          </View>
        </View>
      </Animated.View>
      
      <View style={[styles.indicatorContainer, { borderColor: dynamicColor() }]}>
        <Text style={[styles.indicatorText, { color: dynamicColor() }]}>
          Magnitude: {Math.sqrt(data.x**2 + data.y**2 + data.z**2).toFixed(2)}
        </Text>
      </View>
    </LinearGradient>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  card: {
    width: width - 40,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    width: 40,
    color: '#333',
    textAlign: 'center',
  },
  valueWrapper: {
    flex: 1,
    marginLeft: 20,
  },
  value: {
    fontSize: 22,
    color: '#333',
    marginBottom: 8,
  },
  bar: {
    height: 10,
    borderRadius: 5,
  },
  indicatorContainer: {
    marginTop: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  indicatorText: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
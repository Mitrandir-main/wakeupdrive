import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface TextDisplayProps {
  text: string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#1E1B4B',
    borderRadius: 8,
    marginVertical: 8,
  },
  text: {
    color: '#E2E8F0',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default TextDisplay; 
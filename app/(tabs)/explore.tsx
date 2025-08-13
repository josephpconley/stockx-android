import { Image } from 'expo-image';
import { Platform, StyleSheet, Button, FlatList, TextInput } from 'react-native';
import { useState } from 'react';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTickers } from '@/contexts/TickerContext';

export default function StocksScreen() {
  const { tickers, addTicker, removeTicker } = useTickers();
  const [newTicker, setNewTicker] = useState('');

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add stock ticker"
        value={newTicker}
        onChangeText={setNewTicker}
      />
      <Button title="Add Ticker" onPress={() => { addTicker(newTicker); setNewTicker(''); }} />
      <FlatList
        data={tickers}
        renderItem={({ item }) => (
          <ThemedView style={styles.tickerItem}>
            <ThemedText>{item}</ThemedText>
            <Button title="Remove" onPress={() => removeTicker(item)} />
          </ThemedView>
        )}
        keyExtractor={(item) => item}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
  },
  tickerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

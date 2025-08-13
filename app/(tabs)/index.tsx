import { Image } from 'expo-image';
import { FlatList, Platform, StyleSheet, Button, TextInput } from 'react-native';
import { useState, useEffect } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { PostCard } from '@/components/PostCard';
import { Post } from '@/types/Post';
import { useTickers } from '@/contexts/TickerContext';

interface TickerItem {
  cik_str: number;
  ticker: string;
  title: string;
}

interface FilingsResponse {
  filings: {
    recent: {
      accessionNumber: string[];
      filingDate: string[];
      form: string[];
      primaryDocument: string[];
    };
  };
}

export default function HomeScreen() {
  const [tickers, setTickers] = useState<string[]>(['PAR', 'SKYH', 'UPST']);
  const [newTicker, setNewTicker] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allPosts: Post[] = [];
      let id = 1;
      for (const ticker of tickers) {
        try {
          // Fetch CIK for ticker
          const tickerRes = await fetch('https://www.sec.gov/files/company_tickers.json', {
            headers: {
              'User-Agent': 'YourName your.email@example.com', // Use your real name and email
              'Accept': 'application/json'
            }
          });
          if (!tickerRes.ok) {
            throw new Error(`Failed to fetch tickers: ${tickerRes.status}`);
          }
          const tickerData: { [key: string]: TickerItem } = await tickerRes.json();
          const cikData = Object.values(tickerData).find((item) => item.ticker === ticker);
          if (!cikData) continue;
          const cik = cikData.cik_str.toString().padStart(10, '0');

          // Fetch filings
          const filingsRes = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, {
            headers: {
              'User-Agent': 'YourName your.email@example.com', // Use your real name and email
              'Accept': 'application/json'
            }
          });
          if (!filingsRes.ok) {
            throw new Error(`Failed to fetch filings for ${ticker}: ${filingsRes.status}`);
          }
          const filingsData: FilingsResponse = await filingsRes.json();
          const recentFilings = filingsData.filings.recent;
          for (let i = 0; i < Math.min(5, recentFilings.accessionNumber.length); i++) {
            allPosts.push({
              id: id++,
              stockName: ticker,
              fileType: recentFilings.form[i],
              link: `https://www.sec.gov/Archives/edgar/data/${cikData.cik_str}/${recentFilings.accessionNumber[i].replace(/-/g, '')}/${recentFilings.primaryDocument[i]}`,
              date: recentFilings.filingDate[i],
              summary: `Filing for ${ticker} - ${recentFilings.form[i]}`,
            });
          }
        } catch (error: any) {
          console.error(`Error fetching data for ${ticker}:`, error.message);
        }
      }
      allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(allPosts);
      setLoading(false);
    };
    fetchData();
  }, [tickers]);

  const addTicker = () => {
    if (newTicker && !tickers.includes(newTicker.toUpperCase())) {
      setTickers([...tickers, newTicker.toUpperCase()]);
      setNewTicker('');
    }
  };

  if (loading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  return (
    <ThemedView style={styles.container}>
      {loading ? <ThemedText>Loading...</ThemedText> : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
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
});

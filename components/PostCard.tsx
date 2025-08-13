import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ExternalLink } from '@/components/ExternalLink';

import { Post } from '@/types/Post';

export function PostCard({ post }: { post: Post }) {
  return (
    <ThemedView style={styles.card}>
      <ThemedText type="title">{post.stockName} - {post.fileType}</ThemedText>
      <ThemedText>Filed on: {post.date}</ThemedText>
      <ThemedText>Summary: {post.summary}</ThemedText>
      <ExternalLink href={post.link}>
        <ThemedText type="link">View Filing</ThemedText>
      </ExternalLink>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

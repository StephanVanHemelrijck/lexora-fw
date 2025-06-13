// components/layouts/ScreenContainer.tsx
import { View, StyleSheet } from 'react-native';
import { Colors, Spacing } from '@lexora/styles';

export default function ScreenContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.screenGutter,
  },
});

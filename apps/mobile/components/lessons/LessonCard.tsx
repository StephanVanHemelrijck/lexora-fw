import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Icon } from '../ui/Icon';
import { BorderRadius, Colors, FontSizes, Spacing } from '@lexora/styles';
import { ProgressIndicator } from '../ui/ProgressIndicator';

export default function LessonCard() {
  return (
    <View style={styles.card}>
      <ProgressIndicator
        current={25}
        total={60}
        height="thin"
        type="circle"
        size={48}
      />
      <View>
        <Text style={styles.cardTitle}>Grammar: Future Tense</Text>
        <View style={styles.cardText}>
          <Icon
            name="clock"
            size={20}
            color={Colors.textLight}
            library="Feather"
          />
          <Text style={styles.cardText}>25 min</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.main,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
  },
  cardTitle: {
    fontSize: FontSizes.h3,
    fontWeight: 'bold',
    marginBottom: Spacing.s,
    color: Colors.textLight,
  },
  cardText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
    color: Colors.textLight,
  },
});

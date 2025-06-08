import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Icon } from '../ui/Icon';
import { BorderRadius, Colors, FontSizes, Spacing } from '@lexora/styles';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { Lesson } from '@lexora/types';

interface Props {
  lesson: Lesson;
}

export default function LessonCard({ lesson }: Props) {
  useEffect(() => {
    console.log(lesson);
  }, [lesson]);

  return (
    <View style={styles.card}>
      <ProgressIndicator
        current={25}
        total={60}
        height="thin"
        type="circle"
        size={48}
      />
      <View style={styles.cardContent}>
        <Text numberOfLines={2} style={styles.cardTitle}>
          {lesson.focus}
        </Text>
        <View style={styles.cardMeta}>
          <Icon
            name="clock"
            size={16}
            color={Colors.textLight}
            library="Feather"
          />
          <Text style={styles.cardMetaText}>{lesson.estimatedMinutes} min</Text>
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
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: FontSizes.h3,
    fontWeight: 'bold',
    marginBottom: Spacing.s,
    color: Colors.textLight,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s,
  },
  cardMetaText: {
    color: Colors.textLight,
    fontSize: FontSizes.body,
  },
});

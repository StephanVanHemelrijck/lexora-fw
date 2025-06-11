import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon } from '../ui/Icon';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontStyles,
  Spacing,
} from '@lexora/styles';
import { ProgressIndicator } from '../ui/ProgressIndicator';
import { Lesson } from '@lexora/types';
import { useLessonProgressStore } from '@/stores/useLessonProgressStore';
import { format } from 'date-fns';

interface Props {
  lesson: Lesson;

  onPress?: (lesson: Lesson) => void;
}

export default function LessonCard({ lesson, onPress }: Props) {
  const { progress } = useLessonProgressStore();
  const lessonProgress = progress[lesson.id] ?? { completed: 0, total: 1 };
  const [isCompleted, setIsCompleted] = useState(false);
  const [finishedDate, setFinishedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (lesson.isCompleted) {
      setIsCompleted(true);

      console.log(lesson.lessonResult);
      if (lesson.lessonResult.completedAt) {
        {
          const date = new Date(lesson.lessonResult.completedAt);
          console.log(date);
          setFinishedDate(date);
        }
      }
    }
  }, [lesson]);

  return (
    <View style={styles.card}>
      {isCompleted ? (
        <ProgressIndicator
          current={1} // If completed force to 1 (giving full slider)
          total={1} // If completed force to 1 (giving full slider)
          height="thin"
          type="circle"
          size={48}
        />
      ) : (
        <ProgressIndicator
          current={lessonProgress.completed}
          total={lessonProgress.total}
          height="thin"
          type="circle"
          size={48}
        />
      )}
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => {
          if (onPress) onPress(lesson);
        }}
      >
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
          <View style={styles.textWrapper}>
            <Text style={styles.cardMetaText}>
              {lesson.estimatedMinutes} min
            </Text>
            {isCompleted && finishedDate && (
              <Text style={styles.cardDateText}>
                {format(finishedDate, 'dd/MM/yyyy')}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
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
  textWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardDateText: {
    color: Colors.disabled,
    fontSize: FontSizes.caption,
    textAlign: 'right',
    fontStyle: FontStyles.italic,
  },
});

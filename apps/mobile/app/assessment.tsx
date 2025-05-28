import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { useAuth } from '@lexora/auth';
import { api } from '@lexora/api-client';
import { Assessment, QuestionItem } from '@lexora/types';
import { extractAndShuffleQuestions } from '@lexora/utils';

import { MultipleChoiceQuestion } from '@/components/assessment/MultipleChoiceQuestion';
import { FillInTheBlankQuestion } from '@/components/assessment/FillInTheBlankQuestion';
import WritingPromptQuestion from '@/components/assessment/WritingPromptQuestion';
import ReadingComprehensionQuestion from '@/components/assessment/ReadingComprehensionQuestion';
import { ProgressIndicator } from '@/components/ui/ProgessIndicator';
import { Icon } from '@/components/ui/Icon';
import { useRouter } from 'expo-router';

export default function AssessmentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [simpleAnswers, setSimpleAnswers] = useState<Record<number, string>>(
    {}
  );
  const [readingAnswers, setReadingAnswers] = useState<
    Record<number, Record<number, string>>
  >({});

  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex] ?? null,
    [questions, currentQuestionIndex]
  );

  const isCurrentQuestionAnswered = useMemo(() => {
    const q = currentQuestion;
    const i = currentQuestionIndex;
    if (!q) return false;
    if (q.type === 'reading_comprehension') {
      const sub = readingAnswers[i];
      return (
        sub &&
        Object.keys(sub).length === q.data.questions.length &&
        Object.values(sub).every((a) => !!a?.trim())
      );
    }
    return !!simpleAnswers[i]?.trim();
  }, [currentQuestion, currentQuestionIndex, simpleAnswers, readingAnswers]);

  const answeredCount = useMemo(() => {
    return questions.reduce((count, q, i) => {
      if (q.type === 'reading_comprehension') {
        const sub = readingAnswers[i];
        if (
          sub &&
          Object.keys(sub).length === q.data.questions.length &&
          Object.values(sub).every((a) => !!a)
        ) {
          return count + 1;
        }
      } else if (simpleAnswers[i]) {
        return count + 1;
      }
      return count;
    }, 0);
  }, [questions, simpleAnswers, readingAnswers]);

  useEffect(() => {
    if (user?.uid) {
      // api.get(`/userAssessment/latest/${user.uid}`).then((res) => {
      //   setAssessment(res.data.assessment);
      // });
    }
  }, [user]);

  useEffect(() => {
    if (assessment) {
      setQuestions(extractAndShuffleQuestions(assessment));
      setCurrentQuestionIndex(0);
    }
  }, [assessment]);

  const handleSimpleAnswer = (answer: string) => {
    setSimpleAnswers((prev) => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleReadingAnswer = (subIndex: number, answer: string) => {
    setReadingAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: {
        ...(prev[currentQuestionIndex] || {}),
        [subIndex]: answer,
      },
    }));
  };

  const prepareSubmission = () => {
    const answers = questions.map((q, i) => {
      if (q.type === 'reading_comprehension') {
        return {
          originalIndex: q.originalIndex,
          answers: readingAnswers[i] || {},
        };
      }
      return { originalIndex: q.originalIndex, answer: simpleAnswers[i] };
    });

    return {
      assessmentId: assessment?.id,
      uid: user?.uid,
      answers,
    };
  };

  const handleSubmitAssessment = () => {
    const data = prepareSubmission();
    // api
    //   .post('/userAssessment/submit', data)
    //   .then(() => console.log('Submitted'))
    //   .catch(console.error);
  };

  const renderQuestion = () => {
    if (!currentQuestion)
      return <Text style={{ color: 'white' }}>Loading...</Text>;
    const { type, data } = currentQuestion;
    switch (type) {
      case 'vocabulary_multiple_choice':
      case 'grammar_multiple_choice':
        return (
          <MultipleChoiceQuestion
            questionData={data}
            onAnswer={handleSimpleAnswer}
            selected={simpleAnswers[currentQuestionIndex]}
          />
        );
      case 'fill_in_the_blank':
        return (
          <FillInTheBlankQuestion
            questionData={data}
            onAnswer={handleSimpleAnswer}
            selected={simpleAnswers[currentQuestionIndex]}
          />
        );
      case 'writing_prompt':
        return (
          <WritingPromptQuestion
            questionData={data}
            onAnswer={handleSimpleAnswer}
            selected={simpleAnswers[currentQuestionIndex]}
          />
        );
      case 'reading_comprehension':
        return (
          <ReadingComprehensionQuestion
            questionData={data}
            onAnswer={handleReadingAnswer}
            selected={readingAnswers[currentQuestionIndex] || {}}
          />
        );
      default:
        return (
          <Text style={{ color: 'white' }}>Unsupported question type</Text>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.topBar]}>
        <TouchableOpacity
          onPress={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex((i) => Math.max(i - 1, 0));
            } else {
              router.back();
            }
          }}
          style={styles.backButton}
        >
          <Icon
            name={currentQuestionIndex > 0 ? 'arrow-back' : 'close'}
            size={FontSizes.h1}
            color={Colors.textLight}
            library="Ionicons"
          />
        </TouchableOpacity>

        <View style={styles.progressWrapper}>
          <ProgressIndicator
            current={currentQuestionIndex + 1}
            total={questions.length}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.questionContainer}>{renderQuestion()}</View>
      </ScrollView>

      <View style={styles.buttonWrapper}>
        {currentQuestionIndex < questions.length - 1 ? (
          <TouchableOpacity
            disabled={!isCurrentQuestionAnswered}
            onPress={() =>
              setCurrentQuestionIndex((i) =>
                Math.min(i + 1, questions.length - 1)
              )
            }
            style={[
              styles.nextButton,
              !isCurrentQuestionAnswered && { opacity: 0.5 },
            ]}
          >
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSubmitAssessment}
            style={[
              styles.nextButton,
              !isCurrentQuestionAnswered && { opacity: 0.5 },
            ]}
            disabled={!isCurrentQuestionAnswered}
          >
            <Text style={styles.nextButtonText}>SUBMIT</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.main },
  scrollContent: { paddingHorizontal: Spacing.screenGutter },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Spacing.l,
    paddingTop: Spacing.screenGutter,
    paddingHorizontal: Spacing.screenGutter,
  },
  backButton: { paddingRight: Spacing.s },
  progressWrapper: { flex: 1 },
  questionContainer: { flex: 1, justifyContent: 'flex-start' },
  nextButton: {
    backgroundColor: Colors.actionButton,
    padding: Spacing.m,
    borderRadius: BorderRadius.m,
    alignItems: 'center',
  },
  nextButtonText: {
    color: Colors.textDark,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.h3,
  },
  buttonWrapper: { padding: Spacing.screenGutter },
});

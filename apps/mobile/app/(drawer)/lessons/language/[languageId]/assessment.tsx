import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { extractAndShuffleQuestions } from '@lexora/utils';
import { MultipleChoiceQuestion } from '@/components/assessment/MultipleChoiceQuestion';
import { FillInTheBlankQuestion } from '@/components/assessment/FillInTheBlankQuestion';
import WritingPromptQuestion from '@/components/assessment/WritingPromptQuestion';
import ReadingComprehensionQuestion from '@/components/assessment/ReadingComprehensionQuestion';
import { ProgressIndicator } from '@/components/ui/ProgessIndicator';
import { Icon } from '@/components/ui/Icon';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { useLanguagesStore } from '@/stores/useLanguagesStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@lexora/api-client';
import {
  Language,
  QuestionItem,
  UserAssessment,
  SubmitAssessmentDto,
  SimpleAnswer,
  ReadingAnswer,
  AnswerItem,
} from '@lexora/types';

export default function AssessmentPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const { languageId } = useLocalSearchParams<{ languageId: string }>();
  const { user } = useAuthStore();
  const { getLanguageById } = useLanguagesStore();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [language, setLanguage] = useState<Language>();
  const [assessment, setAssessment] = useState<UserAssessment | null>(null);
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

  useEffect(() => {
    if (!languageId) return;
    getLanguageById(languageId).then(setLanguage).catch(console.error);
  }, [languageId, getLanguageById]);

  useEffect(() => {
    if (!user || !language) return;
    api.userAssessment
      .getActiveOrCreate(user.accessToken, language.id)
      .then(setAssessment)
      .catch(console.error);
  }, [user, language]);

  useEffect(() => {
    if (assessment?.assessment?.questions) {
      setQuestions(extractAndShuffleQuestions(assessment.assessment));
      setCurrentQuestionIndex(0);
    }
  }, [assessment]);

  useEffect(() => {
    if (language) {
      navigation.setOptions({ title: `${language.name} - Assessment` });
    }
  }, [language, navigation]);

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

  const prepareSubmission = (): SubmitAssessmentDto | null => {
    if (!assessment || !user) return null;

    const answers: AnswerItem[] = questions.map((q, i) => {
      if (q.type === 'reading_comprehension') {
        return {
          originalIndex: q.originalIndex,
          answers: readingAnswers[i] || {},
        };
      }

      return {
        originalIndex: q.originalIndex,
        answer: simpleAnswers[i] ?? '',
      };
    });

    return {
      assessmentId: assessment.assessmentId,
      uid: user.uid,
      answers,
    };
  };

  const handleSubmitAssessment = async () => {
    const data = prepareSubmission();
    if (!data || !user || isSubmitting) return;

    setIsSubmitting(true);

    try {
      await api.userAssessment.submit(user.accessToken, data);
      // optionally navigate or show a confirmation here
      router.push({
        pathname: '/lessons/language/[languageId]',
        params: { languageId },
      });
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  if (!assessment) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
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
              (!isCurrentQuestionAnswered || isSubmitting) && { opacity: 0.5 },
            ]}
            disabled={!isCurrentQuestionAnswered || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={Colors.textDark} />
            ) : (
              <Text style={styles.nextButtonText}>SUBMIT</Text>
            )}
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

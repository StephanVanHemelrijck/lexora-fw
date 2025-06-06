import ListeningComprehensionQuestion from '@/components/assessment/ListeningComprehensionQuestion';
import { MultipleChoiceQuestion } from '@/components/assessment/MultipleChoiceQuestion';
import ReadingComprehensionQuestion from '@/components/assessment/ReadingComprehensionQuestion';
import SpeakingRepetitionQuestion from '@/components/assessment/SpeakingRepetitionQuestion';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import Mascot from '@/components/ui/Mascot';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguagesStore } from '@/stores/useLanguagesStore';
import { api } from '@lexora/api-client';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  MascotSizes,
  Spacing,
} from '@lexora/styles';
import { Language, QuestionItem, UserAssessment } from '@lexora/types';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AssessmentPage() {
  const navigation = useNavigation();
  const router = useRouter();
  const { getLanguageById } = useLanguagesStore();
  const { user } = useAuthStore();
  const { languageId } = useLocalSearchParams<{ languageId: string }>();
  const [language, setLanguage] = useState<Language>();
  const [isFetchingAssessment, setIsFetchingAssessment] = useState(false);
  const [userAssessment, setUserAssessment] = useState<UserAssessment>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const currentQuestion = useMemo(
    () => questions[currentQuestionIndex],
    [currentQuestionIndex, questions]
  );

  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const resolve = async () => {
      try {
        const lang = await getLanguageById(languageId);
        setLanguage(lang);
        if (lang) navigation.setOptions({ title: `Assessment - ${lang.name}` });
      } catch (err) {
        console.error(err);
        throw err;
      }
    };
    resolve();
  }, [navigation, getLanguageById, languageId]);

  useEffect(() => {
    if (!user || !languageId) return;

    setIsFetchingAssessment(true);

    api.userAssessment
      .getActiveOrCreate(user.accessToken, languageId)
      .then(setUserAssessment)
      .catch((err) => {
        console.error('[ASSESSMENT]: Fetching Failed', err);
      })
      .finally(() => setIsFetchingAssessment(false));
  }, [user, languageId]);

  useEffect(() => {
    if (!userAssessment) return;

    setQuestions(userAssessment.assessment.questions);
    setAnswers(Array(userAssessment.assessment.questions.length).fill(null));
    setCurrentQuestionIndex(0);
  }, [userAssessment]);

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleAnswer = (answer: string | null) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = answer;
      return updated;
    });
  };

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const { type } = currentQuestion;
    const onAnswer = handleAnswer;

    switch (type) {
      case 'grammar_multiple_choice':
      case 'vocabulary_multiple_choice':
        return (
          <MultipleChoiceQuestion
            questionData={currentQuestion}
            onAnswer={onAnswer}
            selected={answers[currentQuestionIndex]}
          />
        );
      case 'reading_comprehension':
        return (
          <ReadingComprehensionQuestion
            questionData={currentQuestion}
            onAnswer={onAnswer}
            selected={answers[currentQuestionIndex]}
          />
        );
      case 'listening_comprehension':
        return (
          <ListeningComprehensionQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            text_prompt={currentQuestion.text_prompt}
            onAnswer={onAnswer}
            selected={answers[currentQuestionIndex]}
          />
        );
      case 'speaking_repetition':
        return (
          <SpeakingRepetitionQuestion
            prompt={currentQuestion.prompt}
            onAnswer={onAnswer}
            selected={answers[currentQuestionIndex]}
          />
        );
    }
  };

  const handleSubmit = async () => {
    if (!user || !userAssessment) return;

    setIsSubmitting(true);

    const formData = new FormData();
    const normalizedAnswers = answers.map((ans, index) => {
      if (typeof ans === 'string' && ans.startsWith('file://')) {
        formData.append(`audio_${index}`, {
          uri: ans,
          type: 'audio/m4a',
          name: `audio_answer_${index}.m4a`,
        } as any); // Required cast for React Native
        return null; // placeholder for index alignment
      }
      return ans;
    });

    formData.append('assessmentId', userAssessment.assessment.id);
    formData.append('answers', JSON.stringify(normalizedAnswers));

    try {
      await api.userAssessment.submit(user.accessToken, formData);

      router.push({
        pathname: '/lessons/language/[languageId]',
        params: { languageId },
      });
    } catch (err) {
      console.error('[ASSESSMENT]: Submission failed', err);
    } finally {
      // redirect
      setIsSubmitting(false);
    }
  };

  const isQuestionAnswered = answers[currentQuestionIndex] !== null;

  return (
    <View style={styles.container}>
      {isSubmitting ? (
        <View style={styles.loadingContainer}>
          <Mascot
            text="Submitting answers... This could take a few seconds."
            size={MascotSizes.m}
            direction="bottom"
          />
          <ActivityIndicator
            size="large"
            color={Colors.accent}
            style={styles.loadingIndicator}
          />
        </View>
      ) : isFetchingAssessment ? (
        <View style={styles.loadingContainer}>
          <Mascot
            text={`Generating assessment for ${language?.name}... This could take a few seconds.`}
            size={MascotSizes.m}
            direction="bottom"
          />
          <ActivityIndicator
            size="large"
            color={Colors.accent}
            style={styles.loadingIndicator}
          />
        </View>
      ) : (
        <>
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex((i) => Math.max(i - 1, 0));
                } else {
                  router.push({
                    pathname: '/(drawer)/lessons/language/[languageId]',
                    params: { languageId },
                  });
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
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.questionContainer}>{renderQuestion()}</View>
          </ScrollView>
          <View style={styles.buttonWrapper}>
            {currentQuestionIndex + 1 === questions.length ? (
              <Button
                onPress={handleSubmit}
                text="SUBMIT"
                theme="purple"
                disabled={isSubmitting}
              />
            ) : (
              <Button
                onPress={handleNext}
                text="NEXT"
                theme="purple"
                disabled={!isQuestionAnswered}
              />
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.screenGutter,
  },
  loadingIndicator: {
    marginTop: Spacing.l,
  },

  container: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: {
    paddingHorizontal: Spacing.screenGutter,
    flexGrow: 1,
  },
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
  questionContainer: {
    flexGrow: 1,
  },
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

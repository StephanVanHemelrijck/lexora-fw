import ListeningComprehensionQuestion from '@/components/assessment/ListeningComprehensionQuestion';
import { MultipleChoiceQuestion } from '@/components/assessment/MultipleChoiceQuestion';
import ReadingComprehensionQuestion from '@/components/assessment/ReadingComprehensionQuestion';
import SpeakingRepetitionQuestion from '@/components/assessment/SpeakingRepetitionQuestion';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ProgressIndicator } from '@/components/ui/ProgressIndicator';
import { useAuthStore } from '@/stores/useAuthStore';
import { useLanguagesStore } from '@/stores/useLanguagesStore';
import { api } from '@lexora/api-client';
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from '@lexora/styles';
import { Language, QuestionItem, UserAssessment } from '@lexora/types';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
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

    console.log('[ASSESSMENT: UID]', user.uid);
    console.log('[ASSESSMENT: LANGUAGE_ID]', languageId);

    console.log('[ASSESSMENT]: Fetching assessment');

    api.userAssessment
      .getActiveOrCreate(user.accessToken, languageId)
      .then(setUserAssessment)
      .catch((err) => {
        console.error('[ASSESSMENT]: Fetching Failed', err);
      })
      .finally(() => setIsFetchingAssessment(false));

    console.log('[ASSESSMENT]: Fetched assessment');
  }, [user, languageId]);

  useEffect(() => {
    if (!userAssessment) return;

    setQuestions(userAssessment.assessment.questions);
    setCurrentQuestionIndex(0);
  }, [userAssessment]);

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const renderQuestion = () => {
    if (!currentQuestion) return <Text>No question</Text>;

    const { type } = currentQuestion;
    switch (type) {
      case 'grammar_multiple_choice':
      case 'vocabulary_multiple_choice':
        return (
          <MultipleChoiceQuestion
            questionData={{
              question: currentQuestion.question,
              options: currentQuestion.options,
              correct_answer: currentQuestion.correct_answer,
            }}
            onAnswer={() => {}}
          />
        );
      case 'reading_comprehension':
        return (
          <ReadingComprehensionQuestion
            questionData={{
              paragraph: currentQuestion.paragraph,
              question: currentQuestion.question,
              options: currentQuestion.options,
              correct_answer: currentQuestion.correct_answer,
            }}
            onAnswer={() => {}}
          />
        );
      case 'listening_comprehension':
        return (
          <ListeningComprehensionQuestion
            question={currentQuestion.question}
            correct_answer={currentQuestion.correct_answer}
            options={currentQuestion.options}
            text_prompt={currentQuestion.text_prompt}
            onAnswer={() => {}}
          />
        );
      case 'speaking_repetition':
        return (
          <SpeakingRepetitionQuestion
            prompt={currentQuestion.prompt}
            onAnswer={() => {}}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {isFetchingAssessment && <Text>Loading...</Text>}
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
        <Button text="NEXT" onPress={handleNext} theme="purple" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

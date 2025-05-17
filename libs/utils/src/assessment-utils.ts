import { Assessment, QuestionItem } from '@lexora/types';

export function extractAndShuffleQuestions(
  assessment: Assessment
): QuestionItem[] {
  const { questions } = assessment;
  const shuffledQuestions = shuffleQuestions(questions);
  console.log('shuffledQuestions', shuffledQuestions);
  return shuffledQuestions;
}

function shuffleQuestions(questions: QuestionItem[]): QuestionItem[] {
  const shuffled = questions.map((q, i) => ({ ...q, originalIndex: i }));

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

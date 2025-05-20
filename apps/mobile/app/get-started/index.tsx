import React from 'react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import LanguageSelectionStep from './steps/LanguageSelectionStep';
import WelcomeStep from './steps/WelcomeStep';
import WhyLearningStep from './steps/WhyLearningStep';
import RoutineStep from './steps/RoutineStep';
import PlacementStep from './steps/PlacementStep';
import CreateAccountStep from './steps/CreateAccountStep';

const steps = [
  WelcomeStep,
  CreateAccountStep,
  LanguageSelectionStep,
  WhyLearningStep,
  RoutineStep,
  PlacementStep,
];

export default function Index() {
  const { step } = useOnboardingStore();

  const StepComponent = steps[step] || (() => null);

  return <StepComponent />;
}

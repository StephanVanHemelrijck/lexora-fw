import React, { useEffect } from 'react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import LanguageSelectionStep from './steps/LanguageSelectionStep';
import WelcomeStep from './steps/WelcomeStep';
import WhyLearningStep from './steps/WhyLearningStep';
import RoutineStep from './steps/RoutineStep';
import PlacementStep from './steps/PlacementStep';
import CreateAccountStep from './steps/CreateAccountStep';
import WelcomeUserStep from './steps/WelcomeUserStep';
import StartConfirmationStep from './steps/StartConfirmationStep';

const steps = [
  WelcomeStep, //
  CreateAccountStep, // Create account
  WelcomeUserStep, // Greet the user
  LanguageSelectionStep, // Select language
  WhyLearningStep, // Tell us why you want to learn
  RoutineStep, // Tell us how much you'd like to learn
  PlacementStep, // Do placement or start from scratch
  StartConfirmationStep, // Confirm start
];

export default function Index() {
  const { step, setTotalSteps } = useOnboardingStore();

  useEffect(() => {
    setTotalSteps(steps.length - 1);
  }, [setTotalSteps]);

  const StepComponent = steps[step] || (() => null);

  return <StepComponent />;
}

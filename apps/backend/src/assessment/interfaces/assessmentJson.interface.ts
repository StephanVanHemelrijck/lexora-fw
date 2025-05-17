export type AssessmentJson = {
  questions: {
    type: 'multiple_choice' | 'fill_in_blank' | 'writing';
    question?: string;
    options?: string[];
    answer?: string;
    sentence?: string;
    prompt?: string;
  }[];
};

export const AssessmentJson = {} as const;

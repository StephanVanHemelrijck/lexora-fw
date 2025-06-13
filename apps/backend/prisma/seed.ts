import { PrismaClient } from '@prisma/client';
import { seedAiScenarios } from './seed/ai-scenarios';

const prisma = new PrismaClient();

async function main() {
  await prisma.exerciseResult.deleteMany();
  await prisma.lessonResult.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.lessonPlan.deleteMany();
  await prisma.languageJourney.deleteMany();
  await prisma.userAssessment.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.language.deleteMany();
  await prisma.user.deleteMany();
  await prisma.aiScenario.deleteMany();

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flagEmoji: '🇺🇸',
      sortOrder: 1,
      rtl: false,
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flagEmoji: '🇪🇸',
      sortOrder: 2,
      rtl: false,
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flagEmoji: '🇫🇷',
      sortOrder: 3,
      rtl: false,
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flagEmoji: '🇩🇪',
      sortOrder: 4,
      rtl: false,
    },
    {
      code: 'it',
      name: 'Italian',
      nativeName: 'Italiano',
      flagEmoji: '🇮🇹',
      sortOrder: 5,
      rtl: false,
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flagEmoji: '🇵🇹',
      sortOrder: 6,
      rtl: false,
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flagEmoji: '🇨🇳',
      sortOrder: 7,
      rtl: false,
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flagEmoji: '🇯🇵',
      sortOrder: 8,
      rtl: false,
    },
    {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      flagEmoji: '🇰🇷',
      sortOrder: 9,
      rtl: false,
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flagEmoji: '🇸🇦',
      sortOrder: 10,
      rtl: true,
    },
  ];

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: lang,
    });
  }

  console.log('🌍 Seeded languages.');

  await seedAiScenarios(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

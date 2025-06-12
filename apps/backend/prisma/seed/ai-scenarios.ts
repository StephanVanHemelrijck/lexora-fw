import { PrismaClient, ScenarioDifficulty } from '@prisma/client';

export async function seedAiScenarios(prisma: PrismaClient) {
  const aiScenarios = [
    {
      id: 'connect-with-people-0',
      title: 'Connect with people Scenario 1',
      description:
        'A scenario for practicing connect with people [\ud83d\udde3\ufe0f]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Connect with people'],
      prompt:
        'You are practicing a conversation related to connect with people scenario 1. Respond appropriately.',
    },
    {
      id: 'connect-with-people-1',
      title: 'Connect with people Scenario 2',
      description:
        'A scenario for practicing connect with people [\ud83d\udde3\ufe0f]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Connect with people'],
      prompt:
        'You are practicing a conversation related to connect with people scenario 2. Respond appropriately.',
    },
    {
      id: 'connect-with-people-2',
      title: 'Connect with people Scenario 3',
      description:
        'A scenario for practicing connect with people [\ud83d\udde3\ufe0f]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Connect with people'],
      prompt:
        'You are practicing a conversation related to connect with people scenario 3. Respond appropriately.',
    },
    {
      id: 'connect-with-people-3',
      title: 'Connect with people Scenario 4',
      description:
        'A scenario for practicing connect with people [\ud83d\udde3\ufe0f]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Connect with people'],
      prompt:
        'You are practicing a conversation related to connect with people scenario 4. Respond appropriately.',
    },
    {
      id: 'connect-with-people-4',
      title: 'Connect with people Scenario 5',
      description:
        'A scenario for practicing connect with people [\ud83d\udde3\ufe0f]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Connect with people'],
      prompt:
        'You are practicing a conversation related to connect with people scenario 5. Respond appropriately.',
    },
    {
      id: 'travel-0',
      title: 'Travel Scenario 1',
      description: 'A scenario for practicing travel [\u2708\ufe0f]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Travel'],
      prompt:
        'You are practicing a conversation related to travel scenario 1. Respond appropriately.',
    },
    {
      id: 'travel-1',
      title: 'Travel Scenario 2',
      description: 'A scenario for practicing travel [\u2708\ufe0f]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Travel'],
      prompt:
        'You are practicing a conversation related to travel scenario 2. Respond appropriately.',
    },
    {
      id: 'travel-2',
      title: 'Travel Scenario 3',
      description: 'A scenario for practicing travel [\u2708\ufe0f]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Travel'],
      prompt:
        'You are practicing a conversation related to travel scenario 3. Respond appropriately.',
    },
    {
      id: 'travel-3',
      title: 'Travel Scenario 4',
      description: 'A scenario for practicing travel [\u2708\ufe0f]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Travel'],
      prompt:
        'You are practicing a conversation related to travel scenario 4. Respond appropriately.',
    },
    {
      id: 'travel-4',
      title: 'Travel Scenario 5',
      description: 'A scenario for practicing travel [\u2708\ufe0f]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Travel'],
      prompt:
        'You are practicing a conversation related to travel scenario 5. Respond appropriately.',
    },
    {
      id: 'work-/-career-0',
      title: 'Work / Career Scenario 1',
      description: 'A scenario for practicing work / career [\ud83d\udcbc]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Work / Career'],
      prompt:
        'You are practicing a conversation related to work / career scenario 1. Respond appropriately.',
    },
    {
      id: 'work-/-career-1',
      title: 'Work / Career Scenario 2',
      description: 'A scenario for practicing work / career [\ud83d\udcbc]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Work / Career'],
      prompt:
        'You are practicing a conversation related to work / career scenario 2. Respond appropriately.',
    },
    {
      id: 'work-/-career-2',
      title: 'Work / Career Scenario 3',
      description: 'A scenario for practicing work / career [\ud83d\udcbc]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Work / Career'],
      prompt:
        'You are practicing a conversation related to work / career scenario 3. Respond appropriately.',
    },
    {
      id: 'work-/-career-3',
      title: 'Work / Career Scenario 4',
      description: 'A scenario for practicing work / career [\ud83d\udcbc]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Work / Career'],
      prompt:
        'You are practicing a conversation related to work / career scenario 4. Respond appropriately.',
    },
    {
      id: 'work-/-career-4',
      title: 'Work / Career Scenario 5',
      description: 'A scenario for practicing work / career [\ud83d\udcbc]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Work / Career'],
      prompt:
        'You are practicing a conversation related to work / career scenario 5. Respond appropriately.',
    },
    {
      id: 'study-/-school-0',
      title: 'Study / School Scenario 1',
      description: 'A scenario for practicing study / school [\ud83c\udf93]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Study / School'],
      prompt:
        'You are practicing a conversation related to study / school scenario 1. Respond appropriately.',
    },
    {
      id: 'study-/-school-1',
      title: 'Study / School Scenario 2',
      description: 'A scenario for practicing study / school [\ud83c\udf93]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Study / School'],
      prompt:
        'You are practicing a conversation related to study / school scenario 2. Respond appropriately.',
    },
    {
      id: 'study-/-school-2',
      title: 'Study / School Scenario 3',
      description: 'A scenario for practicing study / school [\ud83c\udf93]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Study / School'],
      prompt:
        'You are practicing a conversation related to study / school scenario 3. Respond appropriately.',
    },
    {
      id: 'study-/-school-3',
      title: 'Study / School Scenario 4',
      description: 'A scenario for practicing study / school [\ud83c\udf93]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Study / School'],
      prompt:
        'You are practicing a conversation related to study / school scenario 4. Respond appropriately.',
    },
    {
      id: 'study-/-school-4',
      title: 'Study / School Scenario 5',
      description: 'A scenario for practicing study / school [\ud83c\udf93]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Study / School'],
      prompt:
        'You are practicing a conversation related to study / school scenario 5. Respond appropriately.',
    },
    {
      id: 'culture-&-media-0',
      title: 'Culture & Media Scenario 1',
      description: 'A scenario for practicing culture & media [\ud83c\udfad]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Culture & Media'],
      prompt:
        'You are practicing a conversation related to culture & media scenario 1. Respond appropriately.',
    },
    {
      id: 'culture-&-media-1',
      title: 'Culture & Media Scenario 2',
      description: 'A scenario for practicing culture & media [\ud83c\udfad]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Culture & Media'],
      prompt:
        'You are practicing a conversation related to culture & media scenario 2. Respond appropriately.',
    },
    {
      id: 'culture-&-media-2',
      title: 'Culture & Media Scenario 3',
      description: 'A scenario for practicing culture & media [\ud83c\udfad]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Culture & Media'],
      prompt:
        'You are practicing a conversation related to culture & media scenario 3. Respond appropriately.',
    },
    {
      id: 'culture-&-media-3',
      title: 'Culture & Media Scenario 4',
      description: 'A scenario for practicing culture & media [\ud83c\udfad]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Culture & Media'],
      prompt:
        'You are practicing a conversation related to culture & media scenario 4. Respond appropriately.',
    },
    {
      id: 'culture-&-media-4',
      title: 'Culture & Media Scenario 5',
      description: 'A scenario for practicing culture & media [\ud83c\udfad]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Culture & Media'],
      prompt:
        'You are practicing a conversation related to culture & media scenario 5. Respond appropriately.',
    },
    {
      id: 'for-fun-/-hobby-0',
      title: 'For fun / Hobby Scenario 1',
      description: 'A scenario for practicing for fun / hobby [\ud83c\udfae]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['For fun / Hobby'],
      prompt:
        'You are practicing a conversation related to for fun / hobby scenario 1. Respond appropriately.',
    },
    {
      id: 'for-fun-/-hobby-1',
      title: 'For fun / Hobby Scenario 2',
      description: 'A scenario for practicing for fun / hobby [\ud83c\udfae]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['For fun / Hobby'],
      prompt:
        'You are practicing a conversation related to for fun / hobby scenario 2. Respond appropriately.',
    },
    {
      id: 'for-fun-/-hobby-2',
      title: 'For fun / Hobby Scenario 3',
      description: 'A scenario for practicing for fun / hobby [\ud83c\udfae]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['For fun / Hobby'],
      prompt:
        'You are practicing a conversation related to for fun / hobby scenario 3. Respond appropriately.',
    },
    {
      id: 'for-fun-/-hobby-3',
      title: 'For fun / Hobby Scenario 4',
      description: 'A scenario for practicing for fun / hobby [\ud83c\udfae]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['For fun / Hobby'],
      prompt:
        'You are practicing a conversation related to for fun / hobby scenario 4. Respond appropriately.',
    },
    {
      id: 'for-fun-/-hobby-4',
      title: 'For fun / Hobby Scenario 5',
      description: 'A scenario for practicing for fun / hobby [\ud83c\udfae]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['For fun / Hobby'],
      prompt:
        'You are practicing a conversation related to for fun / hobby scenario 5. Respond appropriately.',
    },
    {
      id: 'move-abroad-0',
      title: 'Move abroad Scenario 1',
      description: 'A scenario for practicing move abroad [\ud83c\udfe0]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Move abroad'],
      prompt:
        'You are practicing a conversation related to move abroad scenario 1. Respond appropriately.',
    },
    {
      id: 'move-abroad-1',
      title: 'Move abroad Scenario 2',
      description: 'A scenario for practicing move abroad [\ud83c\udfe0]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Move abroad'],
      prompt:
        'You are practicing a conversation related to move abroad scenario 2. Respond appropriately.',
    },
    {
      id: 'move-abroad-2',
      title: 'Move abroad Scenario 3',
      description: 'A scenario for practicing move abroad [\ud83c\udfe0]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Move abroad'],
      prompt:
        'You are practicing a conversation related to move abroad scenario 3. Respond appropriately.',
    },
    {
      id: 'move-abroad-3',
      title: 'Move abroad Scenario 4',
      description: 'A scenario for practicing move abroad [\ud83c\udfe0]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Move abroad'],
      prompt:
        'You are practicing a conversation related to move abroad scenario 4. Respond appropriately.',
    },
    {
      id: 'move-abroad-4',
      title: 'Move abroad Scenario 5',
      description: 'A scenario for practicing move abroad [\ud83c\udfe0]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Move abroad'],
      prompt:
        'You are practicing a conversation related to move abroad scenario 5. Respond appropriately.',
    },
    {
      id: 'language-challenge-0',
      title: 'Language challenge Scenario 1',
      description:
        'A scenario for practicing language challenge [\ud83e\udde0]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Language challenge'],
      prompt:
        'You are practicing a conversation related to language challenge scenario 1. Respond appropriately.',
    },
    {
      id: 'language-challenge-1',
      title: 'Language challenge Scenario 2',
      description:
        'A scenario for practicing language challenge [\ud83e\udde0]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Language challenge'],
      prompt:
        'You are practicing a conversation related to language challenge scenario 2. Respond appropriately.',
    },
    {
      id: 'language-challenge-2',
      title: 'Language challenge Scenario 3',
      description:
        'A scenario for practicing language challenge [\ud83e\udde0]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Language challenge'],
      prompt:
        'You are practicing a conversation related to language challenge scenario 3. Respond appropriately.',
    },
    {
      id: 'language-challenge-3',
      title: 'Language challenge Scenario 4',
      description:
        'A scenario for practicing language challenge [\ud83e\udde0]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Language challenge'],
      prompt:
        'You are practicing a conversation related to language challenge scenario 4. Respond appropriately.',
    },
    {
      id: 'language-challenge-4',
      title: 'Language challenge Scenario 5',
      description:
        'A scenario for practicing language challenge [\ud83e\udde0]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Language challenge'],
      prompt:
        'You are practicing a conversation related to language challenge scenario 5. Respond appropriately.',
    },
    {
      id: 'make-new-friends-0',
      title: 'Make new friends Scenario 1',
      description: 'A scenario for practicing make new friends [\ud83e\udd1d]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Make new friends'],
      prompt:
        'You are practicing a conversation related to make new friends scenario 1. Respond appropriately.',
    },
    {
      id: 'make-new-friends-1',
      title: 'Make new friends Scenario 2',
      description: 'A scenario for practicing make new friends [\ud83e\udd1d]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Make new friends'],
      prompt:
        'You are practicing a conversation related to make new friends scenario 2. Respond appropriately.',
    },
    {
      id: 'make-new-friends-2',
      title: 'Make new friends Scenario 3',
      description: 'A scenario for practicing make new friends [\ud83e\udd1d]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Make new friends'],
      prompt:
        'You are practicing a conversation related to make new friends scenario 3. Respond appropriately.',
    },
    {
      id: 'make-new-friends-3',
      title: 'Make new friends Scenario 4',
      description: 'A scenario for practicing make new friends [\ud83e\udd1d]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Make new friends'],
      prompt:
        'You are practicing a conversation related to make new friends scenario 4. Respond appropriately.',
    },
    {
      id: 'make-new-friends-4',
      title: 'Make new friends Scenario 5',
      description: 'A scenario for practicing make new friends [\ud83e\udd1d]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Make new friends'],
      prompt:
        'You are practicing a conversation related to make new friends scenario 5. Respond appropriately.',
    },
    {
      id: 'family-/-heritage-0',
      title: 'Family / Heritage Scenario 1',
      description: 'A scenario for practicing family / heritage [\ud83e\uddec]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Family / Heritage'],
      prompt:
        'You are practicing a conversation related to family / heritage scenario 1. Respond appropriately.',
    },
    {
      id: 'family-/-heritage-1',
      title: 'Family / Heritage Scenario 2',
      description: 'A scenario for practicing family / heritage [\ud83e\uddec]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Family / Heritage'],
      prompt:
        'You are practicing a conversation related to family / heritage scenario 2. Respond appropriately.',
    },
    {
      id: 'family-/-heritage-2',
      title: 'Family / Heritage Scenario 3',
      description: 'A scenario for practicing family / heritage [\ud83e\uddec]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Family / Heritage'],
      prompt:
        'You are practicing a conversation related to family / heritage scenario 3. Respond appropriately.',
    },
    {
      id: 'family-/-heritage-3',
      title: 'Family / Heritage Scenario 4',
      description: 'A scenario for practicing family / heritage [\ud83e\uddec]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Family / Heritage'],
      prompt:
        'You are practicing a conversation related to family / heritage scenario 4. Respond appropriately.',
    },
    {
      id: 'family-/-heritage-4',
      title: 'Family / Heritage Scenario 5',
      description: 'A scenario for practicing family / heritage [\ud83e\uddec]',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Family / Heritage'],
      prompt:
        'You are practicing a conversation related to family / heritage scenario 5. Respond appropriately.',
    },
  ];

  for (const scenario of aiScenarios) {
    await prisma.aiScenario.upsert({
      where: { id: scenario.id },
      update: { ...scenario },
      create: { ...scenario },
    });
  }
  console.log('✅ AI Scenarios seeded');
}

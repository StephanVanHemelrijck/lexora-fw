import { PrismaClient, ScenarioDifficulty } from '@prisma/client';

export async function seedAiScenarios(prisma: PrismaClient) {
  const aiScenarios = [
    // 🗣️ Connect with people
    {
      id: 'connect-0',
      title: 'Meeting someone new at a meetup',
      description:
        'You attend a local meetup and introduce yourself to someone new.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Connect with people'],
      prompt:
        'Start a conversation with someone you’ve just met. Ask their name, what they do, and why they’re here.',
    },
    {
      id: 'connect-1',
      title: 'Making small talk at a bus stop',
      description:
        'You’re waiting for the bus and strike up a light conversation.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Connect with people'],
      prompt:
        'You make small talk with a stranger while waiting for the bus. Talk about the weather or how long the wait is.',
    },
    {
      id: 'connect-2',
      title: 'Talking to someone at the gym',
      description: 'You approach someone at the gym and chat between workouts.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Connect with people'],
      prompt:
        'Introduce yourself to someone at the gym. Ask what they’re training and share your own goals.',
    },
    {
      id: 'connect-3',
      title: 'Chatting in line at a store',
      description: 'You’re in line and strike up a friendly conversation.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Connect with people'],
      prompt:
        'Start a casual conversation with someone next to you in line at a store.',
    },
    {
      id: 'connect-4',
      title: 'Introducing yourself at a hobby group',
      description:
        'You join a hobby group and meet people with similar interests.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Connect with people'],
      prompt:
        'Greet the group and share what you enjoy about the hobby. Ask others why they joined.',
    },

    // ✈️ Travel
    {
      id: 'travel-0',
      title: 'Asking for directions to a bakery',
      description: 'You’re looking for a nearby bakery in a new city.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Travel'],
      prompt:
        'Ask someone on the street where you can find the nearest bakery.',
    },
    {
      id: 'travel-1',
      title: 'Booking a train ticket',
      description: 'You need to buy a train ticket at the station.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Travel'],
      prompt:
        'Talk to a staff member to book a ticket, ask for time, price, and platform info.',
    },
    {
      id: 'travel-2',
      title: 'Checking in at the airport',
      description: 'You arrive at the airport and check in for your flight.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Travel'],
      prompt:
        'Speak to the airline counter to check in and ask about gate and boarding time.',
    },
    {
      id: 'travel-3',
      title: 'Asking about public transport tickets',
      description: 'You want to know how to buy a metro or bus ticket.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Travel'],
      prompt:
        'Ask someone how to get a ticket for public transport and how it works.',
    },
    {
      id: 'travel-4',
      title: 'Asking for help with luggage',
      description: 'You need assistance lifting or storing your suitcase.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Travel'],
      prompt:
        'Ask a stranger or staff member for help with your luggage politely.',
    },

    // 💼 Work / Career
    {
      id: 'career-0',
      title: 'Talking about your job at a networking event',
      description:
        'You meet someone at a professional event and describe your work.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Work / Career'],
      prompt:
        'Explain your job title, responsibilities, and ask what the other person does.',
    },
    {
      id: 'career-1',
      title: 'Asking about job openings',
      description: 'You visit a workplace and ask if they’re hiring.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Work / Career'],
      prompt:
        'Ask someone if there are any job opportunities and how to apply.',
    },
    {
      id: 'career-2',
      title: 'Discussing work hours with your boss',
      description: 'You want to clarify your work schedule with your employer.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Work / Career'],
      prompt: 'Ask about your work schedule, lunch breaks, and weekly hours.',
    },
    {
      id: 'career-3',
      title: 'Giving a short work presentation',
      description: 'You explain your current project to a small team.',
      difficulty: 'hard' as ScenarioDifficulty,
      categories: ['Work / Career'],
      prompt: 'Summarize your current work project and explain your progress.',
    },
    {
      id: 'career-4',
      title: 'Introducing yourself to a new colleague',
      description: 'You meet someone new in your office.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Work / Career'],
      prompt: 'Introduce yourself to a colleague and ask about their role.',
    },

    // 🎓 Study / School
    {
      id: 'school-0',
      title: 'Introducing yourself on the first day of class',
      description: 'It’s the first day and you’re meeting your classmates.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Study / School'],
      prompt: 'Introduce yourself in class and say what you’re studying.',
    },
    {
      id: 'school-1',
      title: 'Asking a teacher for clarification',
      description: 'You didn’t understand something in the lecture.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Study / School'],
      prompt: 'Ask your teacher to explain a topic again in simpler terms.',
    },
    {
      id: 'school-2',
      title: 'Making a study group plan',
      description:
        'You ask classmates to study together and agree on time and place.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Study / School'],
      prompt:
        'Invite classmates to study together and discuss topics to review.',
    },
    {
      id: 'school-3',
      title: 'Asking where the library is',
      description: 'You’re new and need to find the library.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Study / School'],
      prompt:
        'Ask someone where the school library is and what the opening hours are.',
    },
    {
      id: 'school-4',
      title: 'Talking about an upcoming test',
      description:
        'You and a classmate discuss the test material and how you feel.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Study / School'],
      prompt:
        'Talk about how you’re preparing for an exam and what you expect.',
    },

    // 🎭 Culture & Media
    {
      id: 'culture-0',
      title: 'Talking about a recent movie',
      description:
        'You ask someone if they’ve seen a movie and what they thought.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Culture & Media'],
      prompt:
        'Start a conversation about a movie you watched recently. Ask about their opinion too.',
    },
    {
      id: 'culture-1',
      title: 'Asking for music recommendations',
      description:
        'You want to explore local music and ask someone what they like.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Culture & Media'],
      prompt:
        'Ask someone what kind of music they enjoy and if they recommend something.',
    },
    {
      id: 'culture-2',
      title: 'Buying tickets for a concert',
      description: 'You go to a ticket office to ask about a concert.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Culture & Media'],
      prompt: 'Ask about concert times, prices, and seating options.',
    },
    {
      id: 'culture-3',
      title: 'Discussing a book you’re reading',
      description: 'You talk about a book and what you like about it.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Culture & Media'],
      prompt:
        'Describe a book you’re reading and ask the other person if they’ve read it.',
    },
    {
      id: 'culture-4',
      title: 'Talking about favorite TV shows',
      description: 'You and someone else share favorite series.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Culture & Media'],
      prompt: 'Share your favorite TV show and ask for their recommendation.',
    },

    // 🎮 For fun / Hobby
    {
      id: 'fun-0',
      title: 'Talking about weekend plans',
      description: 'You ask someone what they’re doing for fun this weekend.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['For fun / Hobby'],
      prompt: 'Ask about weekend plans and talk about fun activities.',
    },
    {
      id: 'fun-1',
      title: 'Discussing favorite hobbies',
      description: 'You meet someone and talk about personal interests.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['For fun / Hobby'],
      prompt:
        'Talk about your hobbies and ask what they like to do in their free time.',
    },
    {
      id: 'fun-2',
      title: 'Joining a local club',
      description: 'You ask someone about joining a club or hobby group.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['For fun / Hobby'],
      prompt: 'Ask about how to join a club and what people usually do there.',
    },
    {
      id: 'fun-3',
      title: 'Inviting someone to a game night',
      description: 'You want to invite someone to hang out and play games.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['For fun / Hobby'],
      prompt:
        'Invite someone to a casual game night and talk about games you enjoy.',
    },
    {
      id: 'fun-4',
      title: 'Talking about a sport you play',
      description: 'You and someone else discuss playing or watching sports.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['For fun / Hobby'],
      prompt:
        'Talk about your favorite sport and how often you play or watch it.',
    },

    // 🏠 Move abroad
    {
      id: 'abroad-0',
      title: 'Asking about housing options',
      description: 'You’re new in town and want to find a place to live.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Move abroad'],
      prompt:
        'Ask someone where to find apartments and what areas are good to live in.',
    },
    {
      id: 'abroad-1',
      title: 'Opening a bank account',
      description: 'You visit a bank and ask how to open an account.',
      difficulty: 'hard' as ScenarioDifficulty,
      categories: ['Move abroad'],
      prompt:
        'Ask a bank clerk how to open an account and what documents are needed.',
    },
    {
      id: 'abroad-2',
      title: 'Registering for local services',
      description:
        'You need help signing up for internet, electricity, or a phone plan.',
      difficulty: 'hard' as ScenarioDifficulty,
      categories: ['Move abroad'],
      prompt:
        'Ask someone how to register for utilities and what steps to follow.',
    },
    {
      id: 'abroad-3',
      title: 'Visiting a doctor for the first time',
      description: 'You’re new and need to find a medical provider.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Move abroad'],
      prompt:
        'Call or visit a doctor’s office to ask about registering and scheduling.',
    },
    {
      id: 'abroad-4',
      title: 'Asking about language classes',
      description:
        'You want to improve your language skills and look for courses.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Move abroad'],
      prompt: 'Ask someone about language learning classes nearby.',
    },

    // 🧠 Language challenge
    {
      id: 'challenge-0',
      title: 'Explaining a difficult topic',
      description: 'You try to explain something complex in your new language.',
      difficulty: 'hard' as ScenarioDifficulty,
      categories: ['Language challenge'],
      prompt:
        'Explain a topic you care about (e.g. climate change, tech, art) and answer questions.',
    },
    {
      id: 'challenge-1',
      title: 'Correcting a mistake mid-conversation',
      description: 'You said something wrong and want to fix it naturally.',
      difficulty: 'hard' as ScenarioDifficulty,
      categories: ['Language challenge'],
      prompt:
        'You notice you made a grammar error. Politely correct yourself and continue.',
    },
    {
      id: 'challenge-2',
      title: 'Telling a short story',
      description: 'You practice telling a past event clearly and confidently.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Language challenge'],
      prompt:
        'Tell someone about something interesting that happened to you last week.',
    },
    {
      id: 'challenge-3',
      title: 'Describing your surroundings',
      description: 'You practice vocabulary by explaining what you see.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Language challenge'],
      prompt: 'Describe your current location to someone in detail.',
    },
    {
      id: 'challenge-4',
      title: 'Talking without using a specific word',
      description: 'You try to describe something without naming it directly.',
      difficulty: 'hard' as ScenarioDifficulty,
      categories: ['Language challenge'],
      prompt:
        'Describe an object without saying its name. Let the other person guess.',
    },

    // 🤝 Make new friends
    {
      id: 'friends-0',
      title: 'Inviting someone for coffee',
      description: 'You want to get to know someone better.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Make new friends'],
      prompt:
        'Invite someone to grab coffee and talk about your shared interests.',
    },
    {
      id: 'friends-1',
      title: 'Talking about your weekend',
      description: 'You and someone else talk about what you did or will do.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Make new friends'],
      prompt: 'Share what you did last weekend and ask about theirs.',
    },
    {
      id: 'friends-2',
      title: 'Going to a movie together',
      description: 'You suggest watching a movie with someone.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Make new friends'],
      prompt:
        'Invite someone to a movie and suggest a few options to choose from.',
    },
    {
      id: 'friends-3',
      title: 'Talking about favorite food',
      description: 'You discuss tastes and maybe plan a meal together.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Make new friends'],
      prompt: 'Talk about your favorite foods and ask what they enjoy most.',
    },
    {
      id: 'friends-4',
      title: 'Playing a game together',
      description: 'You invite someone to play a simple game or app.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Make new friends'],
      prompt: 'Invite someone to try a game with you and explain the rules.',
    },

    // 🧬 Family / Heritage
    {
      id: 'heritage-0',
      title: 'Talking about your family traditions',
      description: 'You share a tradition your family celebrates.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Family / Heritage'],
      prompt:
        'Explain one of your family’s traditions and what it means to you.',
    },
    {
      id: 'heritage-1',
      title: 'Explaining where your family is from',
      description: 'You talk about your background and roots.',
      difficulty: 'easy' as ScenarioDifficulty,
      categories: ['Family / Heritage'],
      prompt:
        'Talk about your family’s country of origin and what you love about it.',
    },
    {
      id: 'heritage-2',
      title: 'Describing a family gathering',
      description: 'You describe who comes, what you eat, and what you do.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Family / Heritage'],
      prompt: 'Describe what happens at a typical family gathering.',
    },
    {
      id: 'heritage-3',
      title: 'Talking about your native language',
      description: 'You explain how you grew up speaking it.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Family / Heritage'],
      prompt:
        'Share what language(s) your family speaks and how it influenced you.',
    },
    {
      id: 'heritage-4',
      title: 'Explaining a family recipe',
      description: 'You walk someone through how to make a family dish.',
      difficulty: 'medium' as ScenarioDifficulty,
      categories: ['Family / Heritage'],
      prompt: 'Explain how to cook a traditional dish your family loves.',
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

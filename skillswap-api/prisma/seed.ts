import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// Constants for seed data generation
const USER_COUNT = 50;
const SKILL_MIN_PER_USER = 3;
const SKILL_MAX_PER_USER = 8;
const AVAILABILITY_MIN_PER_USER = 2;
const AVAILABILITY_MAX_PER_USER = 5;
const CONVERSATION_COUNT = 100;
const MESSAGE_MIN_PER_CONVERSATION = 5;
const MESSAGE_MAX_PER_CONVERSATION = 20;

// Predefined realistic categories with colors
const CATEGORIES = [
  { name: 'Programmation', color: '#FF5733' },
  { name: 'Langues', color: '#33FF57' },
  { name: 'Arts & Musique', color: '#3357FF' },
  { name: 'Sport & Fitness', color: '#F3FF33' },
  { name: 'Cuisine', color: '#FF33F3' },
  { name: 'Enseignement', color: '#33FFF3' },
  { name: 'Design', color: '#A233FF' },
  { name: 'Business', color: '#FF8C33' },
  { name: 'Bricolage', color: '#33FF8C' },
  { name: 'Photographie', color: '#8C33FF' },
  { name: 'Jardinage', color: '#8CFF33' },
  { name: 'Sciences', color: '#FF338C' },
  { name: 'Méditation', color: '#338CFF' },
  { name: 'Littérature', color: '#FFBD33' },
  { name: 'Santé & Bien-être', color: '#33FFBD' },
];

// Predefined skills for each category with diminutives
const SKILLS_BY_CATEGORY = {
  Programmation: [
    { name: 'JavaScript', diminutive: 'JavaScript' },
    { name: 'React', diminutive: 'React' },
    { name: 'Python', diminutive: 'Python' },
    { name: 'Java', diminutive: 'Java' },
    { name: 'TypeScript', diminutive: 'TypeScript' },
    { name: 'PHP', diminutive: 'PHP' },
    { name: 'C++', diminutive: 'C++' },
    { name: 'Node.js', diminutive: 'Node.js' },
    { name: 'SQL', diminutive: 'SQL' },
    { name: 'Swift', diminutive: 'Swift' },
    { name: 'Développement web', diminutive: 'Dev. Web' },
    { name: 'Développement mobile', diminutive: 'Dev. Mobile' },
    { name: 'Intelligence artificielle', diminutive: 'IA' },
    { name: 'Machine Learning', diminutive: 'ML' },
    { name: 'Blockchain', diminutive: 'Blockchain' },
    { name: 'Cybersécurité', diminutive: 'CybSec' },
    { name: 'DevOps', diminutive: 'DevOps' },
    { name: 'Cloud Computing', diminutive: 'Cloud' },
    { name: 'Big Data', diminutive: 'Data' },
    { name: 'API REST', diminutive: 'REST API' },
  ],
  Langues: [
    { name: 'Anglais', diminutive: 'Anglais' },
    { name: 'Espagnol', diminutive: 'Espagnol' },
    { name: 'Français', diminutive: 'Français' },
    { name: 'Allemand', diminutive: 'Allemand' },
    { name: 'Italien', diminutive: 'Italien' },
    { name: 'Japonais', diminutive: 'Japonais' },
    { name: 'Chinois', diminutive: 'Chinois' },
    { name: 'Russe', diminutive: 'Russe' },
    { name: 'Portugais', diminutive: 'Portugais' },
    { name: 'Arabe', diminutive: 'Arabe' },
  ],
  'Arts & Musique': [
    { name: 'Guitare', diminutive: 'Guitare' },
    { name: 'Piano', diminutive: 'Piano' },
    { name: 'Dessin', diminutive: 'Dessin' },
    { name: 'Peinture', diminutive: 'Peinture' },
    { name: 'Chant', diminutive: 'Chant' },
    { name: 'Batterie', diminutive: 'Batterie' },
    { name: 'Théâtre', diminutive: 'Théâtre' },
    { name: 'Danse', diminutive: 'Danse' },
    { name: 'Sculpture', diminutive: 'Sculpture' },
    { name: 'Photographie', diminutive: 'Photo Art' },
  ],
  'Sport & Fitness': [
    { name: 'Yoga', diminutive: 'Yoga' },
    { name: 'Football', diminutive: 'Football' },
    { name: 'Tennis', diminutive: 'Tennis' },
    { name: 'Natation', diminutive: 'Natation' },
    { name: 'Course à pied', diminutive: 'Running' },
    { name: 'Musculation', diminutive: 'Muscu' },
    { name: 'Basketball', diminutive: 'Basket' },
    { name: 'Boxe', diminutive: 'Boxe' },
    { name: 'Cyclisme', diminutive: 'Vélo' },
    { name: 'Escalade', diminutive: 'Escalade' },
  ],
  Cuisine: [
    { name: 'Pâtisserie', diminutive: 'Pâtisserie' },
    { name: 'Cuisine italienne', diminutive: 'Italienne' },
    { name: 'Cuisine asiatique', diminutive: 'Asiatique' },
    { name: 'Cuisine française', diminutive: 'Française' },
    { name: 'BBQ & Grillades', diminutive: 'BBQ' },
    { name: 'Cocktails', diminutive: 'Cocktails' },
    { name: 'Cuisine végétarienne', diminutive: 'Végétarien' },
    { name: 'Boulangerie', diminutive: 'Boulangerie' },
    { name: 'Cuisine mexicaine', diminutive: 'Mexicaine' },
    { name: 'Sushis', diminutive: 'Sushis' },
  ],
  Enseignement: [
    { name: 'Mathématiques', diminutive: 'Maths' },
    { name: 'Sciences', diminutive: 'Sciences' },
    { name: 'Histoire', diminutive: 'Histoire' },
    { name: 'Littérature', diminutive: 'Littérature' },
    { name: 'Philosophie', diminutive: 'Philo' },
    { name: 'Tutorat', diminutive: 'Tutorat' },
    { name: 'Cours particuliers', diminutive: 'Cours Part.' },
    { name: 'Enseignement primaire', diminutive: 'Primaire' },
    { name: 'Enseignement secondaire', diminutive: 'Secondaire' },
    { name: 'Formation adultes', diminutive: 'Adultes' },
  ],
  Design: [
    { name: 'Graphisme', diminutive: 'Graphisme' },
    { name: 'UI/UX Design', diminutive: 'UI/UX' },
    { name: 'Photoshop', diminutive: 'Photoshop' },
    { name: 'Illustrator', diminutive: 'Illustrator' },
    { name: 'Web Design', diminutive: 'WebDesign' },
    { name: 'Animation', diminutive: 'Anim.' },
    { name: 'Figma', diminutive: 'Figma' },
    { name: 'Branding', diminutive: 'Branding' },
  ],
  Business: [
    { name: 'Marketing', diminutive: 'Marketing' },
    { name: 'Comptabilité', diminutive: 'Compta' },
    { name: 'Entrepreneuriat', diminutive: 'Entrepr.' },
    { name: 'Ventes', diminutive: 'Ventes' },
    { name: 'SEO', diminutive: 'SEO' },
    { name: 'Gestion de projet', diminutive: 'Projet' },
    { name: 'Finance', diminutive: 'Finance' },
    { name: 'Ressources humaines', diminutive: 'RH' },
    { name: 'Social Media', diminutive: 'Social' },
    { name: 'Dropshipping', diminutive: 'Dropshipping' },
  ],
  Bricolage: [
    { name: 'Menuiserie', diminutive: 'Menuiserie' },
    { name: 'Plomberie', diminutive: 'Plomberie' },
    { name: 'Électricité', diminutive: 'Électricité' },
    { name: 'Rénovation', diminutive: 'Rénovation' },
    { name: 'Peinture maison', diminutive: 'Peint. Maison' },
    { name: 'Construction', diminutive: 'Construction' },
    { name: 'Décoration', diminutive: 'Décoration' },
    { name: 'Travaux manuels', diminutive: 'Manuels' },
    { name: 'Fabrication DIY', diminutive: 'DIY' },
    { name: 'Réparations', diminutive: 'Réparations' },
  ],
  Photographie: [
    { name: 'Portrait', diminutive: 'Photo Portrait' },
    { name: 'Paysage', diminutive: 'Photo Paysage' },
    { name: 'Photographie de rue', diminutive: 'Photo Rue' },
    { name: 'Lightroom', diminutive: 'Lightroom' },
    { name: 'Photographie de mode', diminutive: 'Photo Mode' },
    { name: 'Photographie culinaire', diminutive: 'Photo Food' },
    { name: 'Photographie animalière', diminutive: 'Photo Animal' },
    { name: 'Photographie de nuit', diminutive: 'Photo Nuit' },
    { name: 'Photographie de mariage', diminutive: 'Photo Mariage' },
    { name: 'Lightpainting', diminutive: 'Lightpainting' },
  ],
  Jardinage: [
    { name: 'Potager', diminutive: 'Potager' },
    { name: 'Horticulture', diminutive: 'Horticulture' },
    { name: 'Compostage', diminutive: 'Compost' },
    { name: 'Permaculture', diminutive: 'Permaculture' },
    { name: "Plantes d'intérieur", diminutive: 'Plantes Int.' },
    { name: 'Bonsaï', diminutive: 'Bonsaï' },
    { name: 'Jardinage biologique', diminutive: 'Bio Jardin' },
    { name: 'Aménagement paysager', diminutive: 'Paysager' },
    { name: 'Hydroponie', diminutive: 'Hydroponie' },
    { name: 'Taille et élagage', diminutive: 'Élagage' },
  ],
  Sciences: [
    { name: 'Astronomie', diminutive: 'Astronomie' },
    { name: 'Biologie', diminutive: 'Biologie' },
    { name: 'Chimie', diminutive: 'Chimie' },
    { name: 'Physique', diminutive: 'Physique' },
    { name: 'Écologie', diminutive: 'Écologie' },
    { name: 'Géologie', diminutive: 'Géologie' },
    { name: 'Météorologie', diminutive: 'Météo' },
    { name: 'Neurosciences', diminutive: 'Neuro' },
    { name: 'Sciences de la Terre', diminutive: 'Terre' },
    { name: 'Génétique', diminutive: 'Génétique' },
  ],
  Méditation: [
    { name: 'Méditation pleine conscience', diminutive: 'Pleine Conscience' },
    { name: 'Yoga méditatif', diminutive: 'Yoga Méditatif' },
    { name: 'Méditation guidée', diminutive: 'Guidée' },
    { name: 'Techniques de respiration', diminutive: 'Respiration' },
    { name: 'Relaxation', diminutive: 'Relaxation' },
    { name: 'Mindfulness', diminutive: 'Mindfulness' },
    { name: 'Zen', diminutive: 'Zen' },
    { name: 'Qi Gong', diminutive: 'Qi Gong' },
    { name: 'Tai Chi', diminutive: 'Tai Chi' },
    { name: 'Spiritualité', diminutive: 'Spiritualité' },
  ],
  Littérature: [
    { name: 'Écriture créative', diminutive: 'Écriture' },
    { name: 'Poésie', diminutive: 'Poésie' },
    { name: 'Roman', diminutive: 'Roman' },
    { name: 'Analyse littéraire', diminutive: 'Analyse' },
    { name: 'Journalisme', diminutive: 'Journalisme' },
    { name: 'Rédaction web', diminutive: 'Rédac. Web' },
    { name: 'Storytelling', diminutive: 'Storytelling' },
    { name: 'Copywriting', diminutive: 'Copywriting' },
    { name: 'Édition', diminutive: 'Édition' },
    { name: 'Autobiographie', diminutive: 'AutoBio' },
  ],
  'Santé & Bien-être': [
    { name: 'Nutrition', diminutive: 'Nutrition' },
    { name: 'Massage', diminutive: 'Massage' },
    { name: 'Aromathérapie', diminutive: 'Aroma' },
    { name: 'Réflexologie', diminutive: 'Réflexo' },
    { name: 'Premiers secours', diminutive: 'Secours' },
    { name: 'Médecine naturelle', diminutive: 'Médecine Nat.' },
    { name: 'Coaching bien-être', diminutive: 'Coaching' },
    { name: 'Sommeil', diminutive: 'Sommeil' },
    { name: 'Gestion du stress', diminutive: 'Stress' },
    { name: 'Sophrologie', diminutive: 'Sophro' },
  ],
};

async function main() {
  console.log('Starting seed...');
  console.time('Seed execution time');

  try {
    // Password for all users (including test user)
    const defaultPassword = 'fakePassword';

    // Clear existing data in the correct order to avoid foreign key constraint errors
    await prisma.$transaction([
      prisma.message.deleteMany({}),
      prisma.conversation.deleteMany({}),
      prisma.userSkill.deleteMany({}),
      prisma.availability.deleteMany({}),
      prisma.skill.deleteMany({}),
      prisma.category.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);

    console.log('Database cleared');

    // Create predefined categories
    const categoryData = CATEGORIES.map((category) => ({
      name: category.name,
      color: category.color,
    }));

    await prisma.category.createMany({
      data: categoryData,
      skipDuplicates: true, // Skip records with duplicate name field
    });

    // Fetch created categories to get their IDs
    const categories = await prisma.category.findMany();
    console.log(`${categories.length} categories created`);

    // Create predefined skills for each category
    const skillsData: Prisma.SkillCreateManyInput[] = [];

    for (const category of categories) {
      const categorySkills =
        SKILLS_BY_CATEGORY[category.name as keyof typeof SKILLS_BY_CATEGORY] ||
        [];

      for (const skill of categorySkills) {
        skillsData.push({
          name: skill.name,
          diminutive: skill.diminutive,
          categoryId: category.id,
        });
      }
    }

    await prisma.skill.createMany({
      data: skillsData,
      skipDuplicates: true, // Skip records with duplicate name field
    });

    // Fetch created skills to get their IDs
    const skills = await prisma.skill.findMany();
    console.log(`${skills.length} skills created`);

    // Create users with Faker data
    const userData: Prisma.UserCreateManyInput[] = [];

    // Pre-generate hashed passwords to avoid async issues in map
    const hashedPasswords = await Promise.all(
      Array.from({ length: USER_COUNT + 1 }).map(() =>
        // +1 for test user
        bcrypt.hash(defaultPassword, SALT_ROUNDS),
      ),
    );

    // Create test user
    userData.push({
      email: 'test@example.com',
      password: hashedPasswords[0],
      firstName: 'Test',
      lastName: 'User',
      biography:
        'Ceci est un utilisateur de test avec des compétences variées.',
      avatarUrl: 'https://randomuser.me/api/portraits/lego/1.jpg',
    });

    for (let i = 0; i < USER_COUNT; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();

      userData.push({
        email,
        password: hashedPasswords[i],
        firstName,
        lastName,
        biography: faker.lorem.paragraph(),
        avatarUrl: faker.image.avatar(),
      });
    }

    await prisma.user.createMany({
      data: userData,
      skipDuplicates: true, // Skip records with duplicate email field
    });

    // Fetch created users to get their IDs
    const users = await prisma.user.findMany();
    console.log(`${users.length} users created`);

    // Assign random skills to users using createMany
    const userSkillsData: Prisma.UserSkillCreateManyInput[] = [];

    // Fetch test user to get its ID
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });

    // Assign specific skills from different categories to test user
    if (testUser) {
      // Get one skill from each of these categories
      const categories = [
        'Programmation',
        'Langues',
        'Cuisine',
        'Sport & Fitness',
        'Design',
      ];

      for (const categoryName of categories) {
        const category = await prisma.category.findUnique({
          where: { name: categoryName },
          include: { skills: { take: 1 } },
        });

        if (category && category.skills.length > 0) {
          userSkillsData.push({
            userId: testUser.id,
            skillId: category.skills[0].id,
          });
        }
      }
    }

    for (const user of users) {
      const selectedSkills = faker.helpers.arrayElements(
        skills,
        faker.number.int({
          min: SKILL_MIN_PER_USER,
          max: SKILL_MAX_PER_USER,
        }),
      );

      for (const skill of selectedSkills) {
        userSkillsData.push({
          userId: user.id,
          skillId: skill.id,
        });
      }
    }

    await prisma.userSkill.createMany({
      data: userSkillsData,
      skipDuplicates: true, // Skip records with duplicate userId + skillId combination
    });

    console.log(`${userSkillsData.length} user skills assigned`);

    // Create availabilities using createMany
    const availabilitiesData: Prisma.AvailabilityCreateManyInput[] = [];
    const days = [0, 1, 2, 3, 4, 5, 6];

    // Add specific availabilities for test user
    if (testUser) {
      // Add availability for Monday, Wednesday and Friday (days 1, 3, 5)
      availabilitiesData.push({
        userId: testUser.id,
        day: 1, // Monday
        startTime: new Date(2025, 0, 1, 9, 0, 0),
        endTime: new Date(2025, 0, 1, 12, 0, 0),
      });

      availabilitiesData.push({
        userId: testUser.id,
        day: 3, // Wednesday
        startTime: new Date(2025, 0, 1, 14, 0, 0),
        endTime: new Date(2025, 0, 1, 17, 0, 0),
      });

      availabilitiesData.push({
        userId: testUser.id,
        day: 5, // Friday
        startTime: new Date(2025, 0, 1, 10, 0, 0),
        endTime: new Date(2025, 0, 1, 15, 0, 0),
      });
    }

    for (const user of users) {
      const selectedDays = faker.helpers.arrayElements(
        days,
        faker.number.int({
          min: AVAILABILITY_MIN_PER_USER,
          max: AVAILABILITY_MAX_PER_USER,
        }),
      );

      for (const day of selectedDays) {
        const startHour = faker.number.int({ min: 8, max: 16 });
        const endHour = faker.number.int({ min: startHour + 1, max: 19 });

        availabilitiesData.push({
          userId: user.id,
          day,
          startTime: new Date(2025, 0, 1, startHour, 0, 0),
          endTime: new Date(2025, 0, 1, endHour, 0, 0),
        });
      }
    }

    await prisma.availability.createMany({
      data: availabilitiesData,
      skipDuplicates: true, // Skip records with duplicate userId + day combination
    });

    console.log(`${availabilitiesData.length} availabilities created`);

    // Create conversations using createMany
    const conversationsData: Prisma.ConversationCreateManyInput[] = [];

    for (let i = 0; i < CONVERSATION_COUNT && users.length >= 2; i++) {
      const [user1, user2] = faker.helpers.arrayElements(users, 2);

      conversationsData.push({
        creatorId: user1.id,
        partnerId: user2.id,
      });
    }

    await prisma.conversation.createMany({
      data: conversationsData,
      skipDuplicates: true, // Skip records with duplicate creatorId + partnerId combination
    });

    // Fetch created conversations to get their IDs
    const conversations = await prisma.conversation.findMany();
    console.log(`${conversations.length} conversations created`);

    // Add messages to conversations using createMany
    const messagesData: Prisma.MessageCreateManyInput[] = [];

    for (const conversation of conversations) {
      const messageCount = faker.number.int({
        min: MESSAGE_MIN_PER_CONVERSATION,
        max: MESSAGE_MAX_PER_CONVERSATION,
      });
      const { creatorId, partnerId } = conversation;

      // Determine who sends the first message
      let lastSenderId = faker.helpers.arrayElement([creatorId, partnerId]);

      // Create all messages for this conversation
      for (let i = 0; i < messageCount; i++) {
        messagesData.push({
          conversationId: conversation.id,
          senderId: lastSenderId,
          content: faker.lorem.paragraph(),
          createdAt: faker.date.recent({ days: 30 }),
        });

        // Alternate senders
        lastSenderId = lastSenderId === creatorId ? partnerId : creatorId;
      }
    }

    await prisma.message.createMany({
      data: messagesData,
      // No skipDuplicates for messages as they should all be unique
    });

    console.log(`${messagesData.length} messages created`);
    console.timeEnd('Seed execution time');
    console.log(
      `Seed completed successfully with ${users.length} users, ${skills.length} skills, ${userSkillsData.length} user skills, ${availabilitiesData.length} availabilities, ${conversations.length} conversations, and ${messagesData.length} messages.`,
    );
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

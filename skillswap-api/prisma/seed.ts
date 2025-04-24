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
    { name: 'JavaScript', diminutive: 'JS' },
    { name: 'React', diminutive: 'RCT' },
    { name: 'Python', diminutive: 'PY' },
    { name: 'Java', diminutive: 'JAV' },
    { name: 'TypeScript', diminutive: 'TS' },
    { name: 'PHP', diminutive: 'PHP' },
    { name: 'C++', diminutive: 'CPP' },
    { name: 'Node.js', diminutive: 'NODE' },
    { name: 'SQL', diminutive: 'SQL' },
    { name: 'Swift', diminutive: 'SWF' },
    { name: 'Développement web', diminutive: 'DEV' },
    { name: 'Développement mobile', diminutive: 'DVM' },
    { name: 'Intelligence artificielle', diminutive: 'IA' },
    { name: 'Machine Learning', diminutive: 'ML' },
    { name: 'Blockchain', diminutive: 'BC' },
    { name: 'Cybersécurité', diminutive: 'CS' },
    { name: 'DevOps', diminutive: 'DEV' },
    { name: 'Cloud Computing', diminutive: 'CC' },
    { name: 'Big Data', diminutive: 'BD' },
    { name: 'API REST', diminutive: 'API' },
  ],
  Langues: [
    { name: 'Anglais', diminutive: 'ANG' },
    { name: 'Espagnol', diminutive: 'ESP' },
    { name: 'Français', diminutive: 'FRA' },
    { name: 'Allemand', diminutive: 'ALL' },
    { name: 'Italien', diminutive: 'ITA' },
    { name: 'Japonais', diminutive: 'JAP' },
    { name: 'Chinois', diminutive: 'CHI' },
    { name: 'Russe', diminutive: 'RUS' },
    { name: 'Portugais', diminutive: 'POR' },
    { name: 'Arabe', diminutive: 'ARA' },
  ],
  'Arts & Musique': [
    { name: 'Guitare', diminutive: 'GUI' },
    { name: 'Piano', diminutive: 'PIA' },
    { name: 'Dessin', diminutive: 'DES' },
    { name: 'Peinture', diminutive: 'PNT' },
    { name: 'Chant', diminutive: 'CHT' },
    { name: 'Batterie', diminutive: 'BAT' },
    { name: 'Théâtre', diminutive: 'THE' },
    { name: 'Danse', diminutive: 'DNS' },
    { name: 'Sculpture', diminutive: 'SCL' },
    { name: 'Photographie', diminutive: 'PHO' },
  ],
  'Sport & Fitness': [
    { name: 'Yoga', diminutive: 'YOG' },
    { name: 'Football', diminutive: 'FTB' },
    { name: 'Tennis', diminutive: 'TEN' },
    { name: 'Natation', diminutive: 'NAT' },
    { name: 'Course à pied', diminutive: 'CAP' },
    { name: 'Musculation', diminutive: 'MUS' },
    { name: 'Basketball', diminutive: 'BSK' },
    { name: 'Boxe', diminutive: 'BOX' },
    { name: 'Cyclisme', diminutive: 'CYC' },
    { name: 'Escalade', diminutive: 'ESC' },
  ],
  Cuisine: [
    { name: 'Pâtisserie', diminutive: 'PAT' },
    { name: 'Cuisine italienne', diminutive: 'CIT' },
    { name: 'Cuisine asiatique', diminutive: 'CAS' },
    { name: 'Cuisine française', diminutive: 'CFR' },
    { name: 'BBQ & Grillades', diminutive: 'BBQ' },
    { name: 'Cocktails', diminutive: 'COC' },
    { name: 'Cuisine végétarienne', diminutive: 'VEG' },
    { name: 'Boulangerie', diminutive: 'BOU' },
    { name: 'Cuisine mexicaine', diminutive: 'CMX' },
    { name: 'Sushis', diminutive: 'SUS' },
  ],
  Enseignement: [
    { name: 'Mathématiques', diminutive: 'MAT' },
    { name: 'Sciences', diminutive: 'SCI' },
    { name: 'Histoire', diminutive: 'HIS' },
    { name: 'Littérature', diminutive: 'LIT' },
    { name: 'Philosophie', diminutive: 'PHI' },
    { name: 'Tutorat', diminutive: 'TUT' },
    { name: 'Cours particuliers', diminutive: 'CPA' },
    { name: 'Enseignement primaire', diminutive: 'EPR' },
    { name: 'Enseignement secondaire', diminutive: 'ESE' },
    { name: 'Formation adultes', diminutive: 'FAD' },
  ],
  Design: [
    { name: 'Graphisme', diminutive: 'GRA' },
    { name: 'UI/UX Design', diminutive: 'UIX' },
    { name: 'Photoshop', diminutive: 'PSD' },
    { name: 'Illustrator', diminutive: 'ILL' },
    { name: 'Web Design', diminutive: 'WEB' },
    { name: "Design d'intérieur", diminutive: 'DIN' },
    { name: 'Modélisation 3D', diminutive: 'M3D' },
    { name: 'Animation', diminutive: 'ANI' },
    { name: 'Figma', diminutive: 'FIG' },
    { name: 'Branding', diminutive: 'BRA' },
  ],
  Business: [
    { name: 'Marketing', diminutive: 'MKT' },
    { name: 'Comptabilité', diminutive: 'CMP' },
    { name: 'Entrepreneuriat', diminutive: 'ENT' },
    { name: 'Ventes', diminutive: 'VNT' },
    { name: 'SEO', diminutive: 'SEO' },
    { name: 'Gestion de projet', diminutive: 'GDP' },
    { name: 'Finance', diminutive: 'FIN' },
    { name: 'Ressources humaines', diminutive: 'RH' },
    { name: 'Social Media', diminutive: 'SMM' },
    { name: 'Dropshipping', diminutive: 'DRP' },
  ],
  Bricolage: [
    { name: 'Menuiserie', diminutive: 'MEN' },
    { name: 'Plomberie', diminutive: 'PLO' },
    { name: 'Électricité', diminutive: 'ELE' },
    { name: 'Rénovation', diminutive: 'REN' },
    { name: 'Peinture maison', diminutive: 'PMN' },
    { name: 'Construction', diminutive: 'CON' },
    { name: 'Décoration', diminutive: 'DEC' },
    { name: 'Travaux manuels', diminutive: 'TMA' },
    { name: 'Fabrication DIY', diminutive: 'DIY' },
    { name: 'Réparations', diminutive: 'REP' },
  ],
  Photographie: [
    { name: 'Portrait', diminutive: 'POR' },
    { name: 'Paysage', diminutive: 'PAY' },
    { name: 'Photographie de rue', diminutive: 'RUE' },
    { name: 'Lightroom', diminutive: 'LRM' },
    { name: 'Photographie de mode', diminutive: 'MOD' },
    { name: 'Photographie culinaire', diminutive: 'CUL' },
    { name: 'Photographie animalière', diminutive: 'ANI' },
    { name: 'Photographie de nuit', diminutive: 'NUI' },
    { name: 'Photographie de mariage', diminutive: 'MAR' },
    { name: 'Lightpainting', diminutive: 'LPT' },
  ],
  Jardinage: [
    { name: 'Potager', diminutive: 'POT' },
    { name: 'Horticulture', diminutive: 'HOR' },
    { name: 'Compostage', diminutive: 'COM' },
    { name: 'Permaculture', diminutive: 'PER' },
    { name: "Plantes d'intérieur", diminutive: 'PIN' },
    { name: 'Bonsaï', diminutive: 'BON' },
    { name: 'Jardinage biologique', diminutive: 'BIO' },
    { name: 'Aménagement paysager', diminutive: 'PAY' },
    { name: 'Hydroponie', diminutive: 'HYD' },
    { name: 'Taille et élagage', diminutive: 'TAI' },
  ],
  Sciences: [
    { name: 'Astronomie', diminutive: 'AST' },
    { name: 'Biologie', diminutive: 'BIO' },
    { name: 'Chimie', diminutive: 'CHM' },
    { name: 'Physique', diminutive: 'PHY' },
    { name: 'Écologie', diminutive: 'ECO' },
    { name: 'Géologie', diminutive: 'GEO' },
    { name: 'Météorologie', diminutive: 'MET' },
    { name: 'Neurosciences', diminutive: 'NEU' },
    { name: 'Sciences de la Terre', diminutive: 'TER' },
    { name: 'Génétique', diminutive: 'GEN' },
  ],
  Méditation: [
    { name: 'Méditation pleine conscience', diminutive: 'MPC' },
    { name: 'Yoga méditatif', diminutive: 'YMD' },
    { name: 'Méditation guidée', diminutive: 'MGD' },
    { name: 'Techniques de respiration', diminutive: 'RSP' },
    { name: 'Relaxation', diminutive: 'RLX' },
    { name: 'Mindfulness', diminutive: 'MND' },
    { name: 'Zen', diminutive: 'ZEN' },
    { name: 'Qi Gong', diminutive: 'QIG' },
    { name: 'Tai Chi', diminutive: 'TAI' },
    { name: 'Spiritualité', diminutive: 'SPR' },
  ],
  Littérature: [
    { name: 'Écriture créative', diminutive: 'ECR' },
    { name: 'Poésie', diminutive: 'POE' },
    { name: 'Roman', diminutive: 'ROM' },
    { name: 'Analyse littéraire', diminutive: 'ALT' },
    { name: 'Journalisme', diminutive: 'JRN' },
    { name: 'Rédaction web', diminutive: 'RDW' },
    { name: 'Storytelling', diminutive: 'STY' },
    { name: 'Copywriting', diminutive: 'CPW' },
    { name: 'Édition', diminutive: 'EDT' },
    { name: 'Autobiographie', diminutive: 'AUT' },
  ],
  'Santé & Bien-être': [
    { name: 'Nutrition', diminutive: 'NUT' },
    { name: 'Massage', diminutive: 'MAS' },
    { name: 'Aromathérapie', diminutive: 'ARO' },
    { name: 'Réflexologie', diminutive: 'REF' },
    { name: 'Premiers secours', diminutive: 'PSC' },
    { name: 'Médecine naturelle', diminutive: 'MNA' },
    { name: 'Coaching bien-être', diminutive: 'CBE' },
    { name: 'Sommeil', diminutive: 'SOM' },
    { name: 'Gestion du stress', diminutive: 'STR' },
    { name: 'Sophrologie', diminutive: 'SPH' },
  ],
};

async function main() {
  console.log('Starting seed...');
  console.time('Seed execution time');

  try {
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
      Array.from({ length: USER_COUNT }).map(() =>
        bcrypt.hash('fakePassword', SALT_ROUNDS),
      ),
    );

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

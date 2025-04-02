import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;


const CATEGORY_COUNT = 15;
const SKILL_MIN_PER_CATEGORY = 5;
const SKILL_MAX_PER_CATEGORY = 10;
const USER_COUNT = 50;
const SKILL_MIN_PER_USER = 3;
const SKILL_MAX_PER_USER = 8;
const AVAILABILITY_MIN_PER_USER = 2;
const AVAILABILITY_MAX_PER_USER = 5;
const CONVERSATION_COUNT = 100;
const MESSAGE_MIN_PER_CONVERSATION = 5;
const MESSAGE_MAX_PER_CONVERSATION = 20;

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

    // Create categories using createMany
    const categoryData = Array.from({ length: CATEGORY_COUNT }).map(() => ({
      name: faker.word.noun(),
      color: faker.color.rgb(),
    }));

    await prisma.category.createMany({
      data: categoryData,
      skipDuplicates: true, // Skip records with duplicate name field
    });

    // Fetch created categories to get their IDs
    const categories = await prisma.category.findMany();
    console.log(`${categories.length} categories created`);

    // Create skills for each category using createMany
    const skillsData: Prisma.SkillCreateManyInput[] = [];

    for (const category of categories) {
      const skillCount = faker.number.int({
        min: SKILL_MIN_PER_CATEGORY,
        max: SKILL_MAX_PER_CATEGORY,
      });

      for (let i = 0; i < skillCount; i++) {
        const skillName = faker.word.adjective() + ' ' + faker.word.noun();

        skillsData.push({
          name: skillName,
          diminutive: skillName
            .replace(/\s+/g, '')
            .substring(0, faker.helpers.arrayElement([3, 4]))
            .toUpperCase(),
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
        bcrypt.hash(faker.internet.password(), SALT_ROUNDS),
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

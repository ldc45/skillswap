import {
  Availability,
  Category,
  Conversation,
  Message,
  PrismaClient,
  Skill,
  User,
  UserSkill,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log('Starting seed...');

  try {
    // Clear existing data
    await prisma.message.deleteMany({});
    await prisma.conversation.deleteMany({});
    await prisma.userSkill.deleteMany({});
    await prisma.availability.deleteMany({});
    await prisma.skill.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('Database cleared');

    // Create categories
    const categories: Category[] = [];
    for (let i = 0; i < 5; i++) {
      const category = await prisma.category.create({
        data: {
          name: faker.word.noun(),
          color: faker.color.rgb(),
        },
      });
      categories.push(category);
    }

    console.log('Categories created');

    // Create skills for each category
    const skills: Skill[] = [];
    for (const category of categories) {
      // Generate between 3 and 6 skills per category
      const skillCount = faker.number.int({ min: 3, max: 6 });

      for (let i = 0; i < skillCount; i++) {
        const skillName = faker.word.adjective() + ' ' + faker.word.noun();

        const skill = await prisma.skill.create({
          data: {
            name: skillName,
            diminutive: skillName
              .replace(/\s+/g, '') // Remove spaces
              .substring(0, faker.helpers.arrayElement([3, 4])) // Take first 3 or 4 letters
              .toUpperCase(), // Convert to uppercase
            categoryId: category.id,
          },
        });
        skills.push(skill);
      }
    }

    console.log('Skills created');

    // Create users with Faker data
    const users: User[] = [];
    const userCount = 10;

    for (let i = 0; i < userCount; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      // Generate email based on first and last name and convert to lowercase
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();
      const password = await bcrypt.hash(
        faker.internet.password(),
        SALT_ROUNDS,
      );

      const user = await prisma.user.create({
        data: {
          email,
          password,
          firstName,
          lastName,
          biography: faker.lorem.paragraph(),
          avatarUrl: faker.image.avatar(),
        },
      });

      users.push(user);
    }

    console.log('Users created');

    // Assign random skills to users
    const userSkills: UserSkill[] = [];
    for (const user of users) {
      // Assign 1 to 5 random skills to each user
      const selectedSkills = faker.helpers.arrayElements(
        skills,
        faker.number.int({ min: 1, max: 5 }),
      );

      for (const skill of selectedSkills) {
        const userSkill = await prisma.userSkill.create({
          data: {
            userId: user.id,
            skillId: skill.id,
          },
        });
        userSkills.push(userSkill);
      }
    }

    console.log('User skills assigned');

    // Create availabilities
    const availabilities: Availability[] = [];
    // Define days of the week (1-7, where 1 is Monday)
    const days = [1, 2, 3, 4, 5, 6, 7];

    // Create availabilities for each user
    for (const user of users) {
      // Assign 1 to 3 random days to each user
      const selectedDays = faker.helpers.arrayElements(
        days,
        faker.number.int({ min: 1, max: 3 }),
      );

      for (const day of selectedDays) {
        // Generate random start hour between 8am and 4pm
        const startHour = faker.number.int({ min: 8, max: 16 });
        // Generate random end hour that's later than start hour (up to 7pm)
        const endHour = faker.number.int({ min: startHour + 1, max: 19 });

        // Using a fixed date (Jan 1, 2025) - only the time matters
        const availability = await prisma.availability.create({
          data: {
            userId: user.id,
            day,
            startTime: new Date(2025, 0, 1, startHour, 0, 0),
            endTime: new Date(2025, 0, 1, endHour, 0, 0),
          },
        });
        availabilities.push(availability);
      }
    }

    console.log('Availabilities created');

    // Create conversations
    const conversations: Conversation[] = [];
    const conversationCount = 15;

    for (let i = 0; i < conversationCount; i++) {
      // Safety check to ensure we have at least 2 users to create a conversation
      // Jump to the next iteration if not enough users
      if (users.length < 2) continue;

      // Randomly select two different users
      const [user1, user2] = faker.helpers.arrayElements(users, 2);

      const conversation = await prisma.conversation.create({
        data: {
          creatorId: user1.id,
          partnerId: user2.id,
        },
      });

      conversations.push(conversation);
    }

    console.log('Conversations created');

    // Add messages to conversations
    const messages: Message[] = [];
    for (const conversation of conversations) {
      // Generate between 2 and 8 messages per conversation
      const messageCount = faker.number.int({ min: 2, max: 8 });
      const { creatorId, partnerId } = conversation;

      // Randomly select which user sends the first message
      let lastSenderId = faker.helpers.arrayElement([creatorId, partnerId]);

      for (let i = 0; i < messageCount; i++) {
        const message = await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: lastSenderId,
            content: faker.lorem.paragraph(),
          },
        });

        messages.push(message);

        // Alternate between senders to simulate a conversation
        lastSenderId = lastSenderId === creatorId ? partnerId : creatorId;
      }
    }

    console.log('Messages created');
    console.log(
      `Seed completed successfully with ${users.length} users, ${skills.length} skills, ${userSkills.length} user skills, ${availabilities.length} availabilities, ${conversations.length} conversations, and ${messages.length} messages.`,
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

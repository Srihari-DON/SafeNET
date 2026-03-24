import prisma from '../lib/firebase';
import { faker } from '@faker-js/faker/locale/en_IN';

// Realistic Indian names for moderators
const indianFirstNames = [
  'Priya', 'Rajesh', 'Anjali', 'Deepa', 'Neha', 'Arjun', 'Vikram', 'Isha',
  'Rohan', 'Kavya', 'Amit', 'Divya', 'Nikhil', 'Shreya', 'Aditya', 'Pooja',
  'Sanjay', 'Preeti', 'Rahul', 'Ananya'
];

const indianLastNames = [
  'Singh', 'Kumar', 'Sharma', 'Patel', 'Gupta', 'Verma', 'Mishra', 'Rao',
  'Menon', 'Iyer', 'Chawla', 'Nair', 'Bhat', 'Desai', 'Joshi', 'Kulkarni'
];

const languages = ['hindi', 'english', 'tamil', 'telugu', 'marathi'];
const trainingModules = [
  'Harassment Detection',
  'Grooming Patterns',
  'Platform Rules',
  'Hindi Abuse Lexicon',
  'Tamil Abuse Lexicon'
];

// Abuse content samples (realistic but appropriately censored)
const abuseTexts = [
  'You are absolutely disgusting! You dont deserve to exist.',
  'How old are you? Can we be friends? 😊',
  '#[SLUR] women shouldnt be allowed on this platform!',
  'Why are you so stupid? Delete this app!',
  'Are you single? Lets chat privately 😉',
  '[THREAT] I know where you live',
  'This is disgusting behavior from your community',
];

const cleanTexts = [
  'Love this video! Great content!',
  'This is a really good recipe for traditional Indian biryani!',
  'Check out my new blog about tech tips!',
  'Just sharing my thoughts on todays great day!',
  'Beautiful sunset photo from my evening walk!',
  'Anyone interested in learning web development?',
  'Best restaurant in town for authentic South Indian food!',
];

const categories = ['harassment', 'grooming', 'hate_speech', 'spam'];
const reasons = [
  'Death wish / life threat',
  'Potential child grooming attempt',
  'Hate speech + gender-based discrimination',
  'Spam / commercial content',
  'Personal harassment',
];

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    await prisma.moderationLog.deleteMany({});
    await prisma.contentItem.deleteMany({});
    await prisma.moderator.deleteMany({});
    await prisma.platform.deleteMany({});
    await prisma.alert.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create Platforms
    const platforms = await prisma.platform.createMany({
      data: [
        {
          name: 'Koo',
          subscriptionTier: 'enterprise',
          monthlySpend: 2500000,
          activeModeratorCount: 25,
          monthlyReviewVolume: 85000,
          contactEmail: 'trust@koo.in',
        },
        {
          name: 'ShareChat',
          subscriptionTier: 'enterprise',
          monthlySpend: 3200000,
          activeModeratorCount: 35,
          monthlyReviewVolume: 120000,
          contactEmail: 'safety@sharechat.com',
        },
        {
          name: 'Bonanza (Beta)',
          subscriptionTier: 'growth',
          monthlySpend: 800000,
          activeModeratorCount: 8,
          monthlyReviewVolume: 25000,
          contactEmail: 'support@bonanza.app',
        },
      ],
    });
    console.log(`✅ Created ${platforms.count} platforms`);

    // Create Moderators
    const moderators = [];
    for (let i = 0; i < 20; i++) {
      const firstName = faker.helpers.arrayElement(indianFirstNames);
      const lastName = faker.helpers.arrayElement(indianLastNames);
      const selectedLanguages = faker.helpers.arrayElements(languages, { min: 1, max: 2 });
      
      const moderator = await prisma.moderator.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: faker.internet.email({ provider: 'safenet.in' }),
          phone: `+91-${faker.string.numeric('5####-#####')}`,
          language: selectedLanguages[0],
          hoursAvailable: faker.number.int({ min: 20, max: 40 }),
          hourlyRate: faker.number.int({ min: 300, max: 500 }),
          trainingStatus: i < 3 ? 'in_training' : 'verified',
          trainedModules: faker.helpers.arrayElements(trainingModules, { min: 2, max: 5 }).map((m: string) => m.replace(/\s+/g, '_').toLowerCase()),
          verifiedAt: i < 3 ? null : faker.date.past({ years: 2 }),
          joinedAt: faker.date.past({ years: 1 }),
          totalReviews: faker.number.int({ min: 100, max: 2000 }),
          accuracyScore: faker.number.float({ min: 80, max: 98, precision: 0.01 }),
          currentStreak: faker.number.int({ min: 1, max: 20 }),
        },
      });
      moderators.push(moderator);
    }
    console.log(`✅ Created ${moderators.length} moderators`);

    // Create Content Items
    const contents = [];
    
    // Create 30 flagged/approved contents
    for (let i = 0; i < 30; i++) {
      const isAbuse = i < 15; // First 15 are abuse
      const moderator = faker.helpers.arrayElement(moderators.slice(0, 10)); // Assign to some moderators
      
      const content = await prisma.contentItem.create({
        data: {
          platformId: faker.helpers.arrayElement(['platform_koo', 'platform_sharechat', 'platform_bonanza']),
          text: isAbuse ? faker.helpers.arrayElement(abuseTexts) : faker.helpers.arrayElement(cleanTexts),
          authorId: `user_${faker.string.numeric('####')}`,
          createdAt: faker.date.recent({ days: 7 }),
          flaggedAt: faker.date.recent({ days: 3 }),
          moderatorId: moderator.id,
          decision: isAbuse ? faker.helpers.arrayElement(['flagged', 'escalated']) : 'approved',
          severity: isAbuse ? faker.helpers.arrayElement(['high', 'critical', 'high', 'medium']) : 'low',
          category: isAbuse ? faker.helpers.arrayElement(categories) : undefined,
          reason: isAbuse ? faker.helpers.arrayElement(reasons) : undefined,
          contextUrl: `https://platform.example.com/posts/${faker.string.numeric('######')}`,
        },
      });
      contents.push(content);
    }

    // Create 15 pending contents
    for (let i = 0; i < 15; i++) {
      await prisma.contentItem.create({
        data: {
          platformId: faker.helpers.arrayElement(['platform_koo', 'platform_sharechat', 'platform_bonanza']),
          text: faker.helpers.arrayElement([...abuseTexts, ...cleanTexts]),
          authorId: `user_${faker.string.numeric('####')}`,
          createdAt: faker.date.recent({ days: 1 }),
          decision: 'pending',
          contextUrl: `https://platform.example.com/posts/${faker.string.numeric('######')}`,
        },
      });
    }
    console.log(`✅ Created ${contents.length + 15} content items`);

    // Create Alerts
    const alerts = await prisma.alert.createMany({
      data: [
        {
          pattern: 'New slur variant in Hindi',
          detectionCount: 45,
          region: 'north_india',
          severity: 'high',
          description: 'Emerging abuse term targeting women activists - detected across multiple platforms',
        },
        {
          pattern: 'Coordinated harassment campaign',
          detectionCount: 120,
          region: 'south_india',
          severity: 'critical',
          description: 'Organized brigade targeting minority community members',
        },
        {
          pattern: 'Election-related misinformation',
          detectionCount: 280,
          region: 'nationwide',
          severity: 'high',
          description: 'Coordinated disinformation campaign spreading false voting information',
        },
        {
          pattern: 'Grooming attempts spike',
          detectionCount: 67,
          region: 'nationwide',
          severity: 'critical',
          description: 'Sharp increase in child safety threats detected in direct messages',
        },
      ],
    });
    console.log(`✅ Created ${alerts.count} alerts`);

    console.log('✨ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

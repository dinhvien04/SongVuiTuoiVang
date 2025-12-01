import mongoose from 'mongoose';
import Activity from '../models/Activity';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const seedActivities = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/songvuikhoe';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');

    // Read seed data
    const seedDataPath = path.join(__dirname, '../../seed-activities.json');
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

    // Clear existing activities (optional - comment out if you want to keep existing data)
    // await Activity.deleteMany({});
    // console.log('🗑️  Cleared existing activities');

    // Insert seed data
    const activities = await Activity.insertMany(seedData);
    console.log(`✅ Successfully seeded ${activities.length} activities`);

    // Display summary
    console.log('\n📊 Summary by category:');
    const summary = activities.reduce((acc: any, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(summary).forEach(([category, count]) => {
      const categoryNames: any = {
        games: '🎮 Trò chơi / Giải trí',
        class: '💚 Chăm sóc sức khỏe',
        music: '🎵 Âm nhạc',
        sports: '🏃 Thể thao / Du lịch',
        other: '📦 Khác',
      };
      console.log(`  ${categoryNames[category]}: ${count} dịch vụ`);
    });

    console.log('\n✨ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding activities:', error);
    process.exit(1);
  }
};

seedActivities();

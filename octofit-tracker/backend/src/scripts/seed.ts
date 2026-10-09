import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const objectId = (value: string) => new mongoose.Types.ObjectId(value);
const user = User;
const team = Team;
const activity = Activity;
const leaderboard = Leaderboard;
const workout = Workout;

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    const users = [
      {
        _id: objectId('660000000000000000000001'),
        username: 'maya.moves',
        email: 'maya@example.com',
        displayName: 'Maya Chen',
        team: objectId('660000000000000000000101'),
      },
      {
        _id: objectId('660000000000000000000002'),
        username: 'liam.runs',
        email: 'liam@example.com',
        displayName: 'Liam Johnson',
        team: objectId('660000000000000000000101'),
      },
      {
        _id: objectId('660000000000000000000003'),
        username: 'sofia.strong',
        email: 'sofia@example.com',
        displayName: 'Sofia Patel',
        team: objectId('660000000000000000000102'),
      },
    ];

    const teams = [
      {
        _id: objectId('660000000000000000000101'),
        name: 'Morning Movers',
        description: 'A team that starts the day with a little movement.',
        members: [users[0]._id, users[1]._id],
      },
      {
        _id: objectId('660000000000000000000102'),
        name: 'Peak Performers',
        description: 'Building strength and stamina one workout at a time.',
        members: [users[2]._id],
      },
    ];

    await user.deleteMany({ _id: { $in: users.map(({ _id }) => _id) } });
    await user.insertMany(users);
    await team.deleteMany({ _id: { $in: teams.map(({ _id }) => _id) } });
    await team.insertMany(teams);

    const activities = [
      {
        _id: objectId('660000000000000000000201'),
        user: users[0]._id,
        type: 'running',
        durationMinutes: 32,
        distanceKm: 4.8,
        points: 48,
        notes: 'Easy loop around the school track.',
        completedAt: new Date('2026-10-06T07:15:00.000Z'),
      },
      {
        _id: objectId('660000000000000000000202'),
        user: users[1]._id,
        type: 'walking',
        durationMinutes: 40,
        distanceKm: 3.2,
        points: 32,
        notes: 'Brisk walk with a friend.',
        completedAt: new Date('2026-10-07T15:30:00.000Z'),
      },
      {
        _id: objectId('660000000000000000000203'),
        user: users[2]._id,
        type: 'strength-training',
        durationMinutes: 28,
        points: 42,
        notes: 'Bodyweight strength circuit.',
        completedAt: new Date('2026-10-08T16:00:00.000Z'),
      },
    ];

    await activity.deleteMany({ _id: { $in: activities.map(({ _id }) => _id) } });
    await activity.insertMany(activities);

    const leaderboardEntries = users.map((user, index) => ({
      _id: objectId(`66000000000000000000030${index + 1}`),
      user: user._id,
      period: 'weekly',
      points: [48, 32, 42][index],
      rank: [1, 3, 2][index],
    }));

    await leaderboard.deleteMany({ _id: { $in: leaderboardEntries.map(({ _id }) => _id) } });
    await leaderboard.insertMany(leaderboardEntries);

    const workouts = [
      {
        _id: objectId('660000000000000000000401'),
        title: 'Steady Start Run',
        description: 'A conversational-pace run to build aerobic endurance.',
        activityType: 'running',
        level: 'beginner',
        durationMinutes: 25,
        instructions: ['Warm up with a five-minute walk.', 'Run at a comfortable pace.', 'Cool down and stretch.'],
      },
      {
        _id: objectId('660000000000000000000402'),
        title: 'After-Class Walk',
        description: 'A brisk walk that fits easily into a school day.',
        activityType: 'walking',
        level: 'beginner',
        durationMinutes: 30,
        instructions: ['Choose a safe route.', 'Walk briskly while keeping a steady pace.', 'Finish with a gentle cooldown.'],
      },
      {
        _id: objectId('660000000000000000000403'),
        title: 'No-Equipment Strength',
        description: 'A balanced bodyweight circuit for a small space.',
        activityType: 'strength-training',
        level: 'intermediate',
        durationMinutes: 20,
        instructions: ['Complete squats, wall push-ups, and glute bridges.', 'Rest between rounds as needed.', 'Focus on controlled form.'],
      },
    ];

    await workout.deleteMany({ _id: { $in: workouts.map(({ _id }) => _id) } });
    await workout.insertMany(workouts);

    console.log('Seeded 3 users, 2 teams, 3 activities, 3 leaderboard entries, and 3 workouts.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();

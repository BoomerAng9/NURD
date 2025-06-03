import { LearningModule } from '../components/learning/module-card';

// Sample data for modules/courses
export const sampleModules: LearningModule[] = [
  {
    id: '1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming with a fun and interactive approach. Perfect for beginners!',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=3270&auto=format&fit=crop',
    category: 'Coding Basics',
    level: 'Beginner',
    duration: '2 hours',
    progress: 100,
    isLocked: false,
    completeCount: 5,
    totalLessons: 5
  },
  {
    id: '2',
    title: 'Web Development Fundamentals',
    description: 'Discover how to build your own websites with HTML, CSS, and JavaScript.',
    imageUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=3174&auto=format&fit=crop',
    category: 'Web Development',
    level: 'Beginner',
    duration: '4 hours',
    progress: 75,
    isLocked: false,
    completeCount: 6,
    totalLessons: 8
  },
  {
    id: '3',
    title: 'Game Development with JavaScript',
    description: 'Create exciting games that you can play and share with friends. Learn game mechanics, physics, animations, and more in this comprehensive course.',
    imageUrl: 'https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=3174&auto=format&fit=crop',
    category: 'Game Development',
    level: 'Intermediate',
    duration: '6 hours',
    progress: 25,
    isLocked: false,
    completeCount: 2,
    totalLessons: 8
  },
  {
    id: '4',
    title: 'Mobile App Design',
    description: 'Learn to design beautiful and functional mobile applications.',
    imageUrl: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=3174&auto=format&fit=crop',
    category: 'UI/UX Design',
    level: 'Intermediate',
    duration: '5 hours',
    progress: 0,
    isLocked: false,
    completeCount: 0,
    totalLessons: 6
  },
  {
    id: '5',
    title: 'AI Project: Build a Chatbot',
    description: 'Create your own AI chatbot using machine learning and natural language processing.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad994?q=80&w=3132&auto=format&fit=crop',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    duration: '8 hours',
    progress: 0,
    isLocked: true,
    completeCount: 0,
    totalLessons: 10
  },
  {
    id: '6',
    title: 'Digital Art Creation',
    description: 'Express your creativity with digital art tools and techniques.',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=3271&auto=format&fit=crop',
    category: 'Digital Art',
    level: 'Beginner',
    duration: '3 hours',
    progress: 0,
    isLocked: false,
    completeCount: 0,
    totalLessons: 5
  },
];
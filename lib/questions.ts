import {
  Users,
  Zap,
  Coffee,
  Home,
  Brain,
  Palette,
  Target,
  Music,
  Sparkles,
  Heart,
  Star,
  Moon,
  Sun,
  Mountain,
  Waves,
  TreePine,
  Camera,
  Book,
  Gamepad2,
  Dumbbell,
  Car,
  Plane,
  MapPin,
  Clock,
  Headphones,
  Mic,
  Guitar,
  Piano,
  Drum,
  Radio,
  Volume2,
  PartyPopper,
  Calendar,
} from 'lucide-react';

export interface Question {
  id: string;
  type: 'multiple-choice' | 'slider' | 'text' | 'image-selection';
  question: string;
  subtitle?: string;
  icon: any;
  options?: { text: string; icon: any; color: string }[];
  images?: { src: string; label: string; icon: any }[];
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
  placeholder?: string;
  category: string;
  tags: string[];
  weight: number;
}

export const QUESTION_POOL: Question[] = [
  {
    id: 'social-energy',
    type: 'multiple-choice',
    question: 'How do you prefer to spend your ideal weekend?',
    subtitle: 'Choose the scenario that energizes you most',
    icon: Users,
    category: 'social',
    tags: ['energy', 'social', 'weekend'],
    weight: 5,
    options: [
      {
        text: 'Hosting a big party with lots of friends',
        icon: Users,
        color: 'from-pink-500 to-rose-500',
      },
      {
        text: 'Having a small gathering with close friends',
        icon: Coffee,
        color: 'from-purple-500 to-indigo-500',
      },
      {
        text: 'Enjoying quiet time alone or with one person',
        icon: Home,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Exploring new places by myself',
        icon: Target,
        color: 'from-green-500 to-emerald-500',
      },
    ],
  },

  {
    id: 'decision-making',
    type: 'slider',
    question:
      'When making important decisions, how much do you rely on logic vs. intuition?',
    subtitle: 'Move the slider to show your natural tendency',
    icon: Brain,
    category: 'thinking',
    tags: ['logic', 'intuition', 'decisions'],
    weight: 5,
    min: 0,
    max: 100,
    leftLabel: 'Pure Logic',
    rightLabel: 'Pure Intuition',
  },

  {
    id: 'adventure-level',
    type: 'multiple-choice',
    question: 'Which adventure sounds most appealing?',
    subtitle: 'Pick the experience that excites you most',
    icon: Zap,
    category: 'risk',
    tags: ['adventure', 'risk', 'excitement'],
    weight: 4,
    options: [
      {
        text: 'Skydiving or bungee jumping',
        icon: Zap,
        color: 'from-red-500 to-orange-500',
      },
      {
        text: 'Trying a new restaurant in town',
        icon: Coffee,
        color: 'from-yellow-500 to-amber-500',
      },
      {
        text: 'Reading a book in a cozy café',
        icon: Home,
        color: 'from-blue-500 to-indigo-500',
      },
      {
        text: 'Planning a detailed itinerary for a trip',
        icon: Target,
        color: 'from-purple-500 to-violet-500',
      },
    ],
  },

  {
    id: 'work-style',
    type: 'image-selection',
    question: 'Which workspace environment helps you thrive?',
    subtitle: 'Select the environment where you feel most productive',
    icon: Home,
    category: 'environment',
    tags: ['work', 'environment', 'productivity'],
    weight: 4,
    images: [
      { src: '/office.jpg', label: 'Busy Open Office', icon: Users },
      { src: '/library.jpg', label: 'Quiet Library', icon: Home },
      { src: '/coffee_shop.jpg', label: 'Bustling Coffee Shop', icon: Coffee },
      { src: '/home_office.jpg', label: 'Cozy Home Office', icon: Target },
    ],
  },

  {
    id: 'stress-response',
    type: 'multiple-choice',
    question: "When you're feeling overwhelmed, what helps you most?",
    subtitle: 'Choose your go-to stress relief method',
    icon: Sparkles,
    category: 'coping',
    tags: ['stress', 'coping', 'relief'],
    weight: 4,
    options: [
      {
        text: 'Talking it out with friends or family',
        icon: Users,
        color: 'from-pink-500 to-purple-500',
      },
      {
        text: 'Going for a run or hitting the gym',
        icon: Zap,
        color: 'from-orange-500 to-red-500',
      },
      {
        text: 'Taking a long bath or meditation',
        icon: Home,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Organizing and making to-do lists',
        icon: Target,
        color: 'from-green-500 to-teal-500',
      },
    ],
  },

  {
    id: 'creativity-level',
    type: 'slider',
    question: 'How important is creative expression in your daily life?',
    subtitle: 'Rate the role creativity plays in your routine',
    icon: Palette,
    category: 'creativity',
    tags: ['creativity', 'expression', 'daily'],
    weight: 4,
    min: 0,
    max: 100,
    leftLabel: 'Not Important',
    rightLabel: 'Essential',
  },

  {
    id: 'future-outlook',
    type: 'text',
    question: 'Describe your biggest dream or aspiration in a few words:',
    subtitle: 'Share what drives you forward (be authentic!)',
    icon: Target,
    category: 'goals',
    tags: ['goals', 'dreams', 'future'],
    weight: 3,
    placeholder:
      'e.g., Travel the world, Start my own business, Make a difference...',
  },

  {
    id: 'music-discovery',
    type: 'multiple-choice',
    question: 'How do you typically discover new music?',
    subtitle: 'Choose your primary music discovery method',
    icon: Headphones,
    category: 'music',
    tags: ['music', 'discovery', 'habits'],
    weight: 3,
    options: [
      {
        text: 'Spotify/Apple Music recommendations',
        icon: Radio,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'Friends and social media',
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Music blogs and reviews',
        icon: Book,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Live concerts and festivals',
        icon: Mic,
        color: 'from-red-500 to-pink-500',
      },
    ],
  },

  {
    id: 'music-mood',
    type: 'slider',
    question:
      'Do you prefer music that matches your current mood or changes it?',
    subtitle: 'How does music interact with your emotions?',
    icon: Heart,
    category: 'music',
    tags: ['music', 'mood', 'emotions'],
    weight: 4,
    min: 0,
    max: 100,
    leftLabel: 'Matches Mood',
    rightLabel: 'Changes Mood',
  },

  {
    id: 'music-energy-time',
    type: 'multiple-choice',
    question: 'When do you listen to your most energetic music?',
    subtitle: 'Think about your daily rhythm',
    icon: Volume2,
    category: 'music',
    tags: ['music', 'energy', 'time'],
    weight: 2,
    options: [
      {
        text: 'Early morning to start my day',
        icon: Sun,
        color: 'from-yellow-500 to-orange-500',
      },
      {
        text: 'During workouts or activities',
        icon: Dumbbell,
        color: 'from-red-500 to-rose-500',
      },
      {
        text: 'Evening when I need motivation',
        icon: Zap,
        color: 'from-purple-500 to-indigo-500',
      },
      {
        text: 'Late night when I feel creative',
        icon: Moon,
        color: 'from-blue-500 to-cyan-500',
      },
    ],
  },

  {
    id: 'morning-routine',
    type: 'multiple-choice',
    question: 'What does your ideal morning look like?',
    subtitle: 'Choose the morning that energizes you',
    icon: Sun,
    category: 'lifestyle',
    tags: ['morning', 'routine', 'energy'],
    weight: 3,
    options: [
      {
        text: 'Up at 5 AM with a structured routine',
        icon: Clock,
        color: 'from-blue-500 to-indigo-500',
      },
      {
        text: 'Slow start with coffee and music',
        icon: Coffee,
        color: 'from-amber-500 to-orange-500',
      },
      {
        text: 'Exercise first thing to get energized',
        icon: Dumbbell,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'Whatever feels right that day',
        icon: Heart,
        color: 'from-pink-500 to-rose-500',
      },
    ],
  },

  {
    id: 'social-media-usage',
    type: 'slider',
    question: 'How much time do you spend on social media daily?',
    subtitle: 'Be honest about your average usage',
    icon: Users,
    category: 'lifestyle',
    tags: ['social', 'media', 'time'],
    weight: 2,
    min: 0,
    max: 8,
    leftLabel: '0 hours',
    rightLabel: '8+ hours',
  },

  {
    id: 'party-preference',
    type: 'multiple-choice',
    question: 'At a party, where are you most likely to be found?',
    subtitle: 'Think about your natural party behavior',
    icon: PartyPopper,
    category: 'social',
    tags: ['party', 'social', 'behavior'],
    weight: 3,
    options: [
      {
        text: 'Center of attention, telling stories',
        icon: Mic,
        color: 'from-red-500 to-pink-500',
      },
      {
        text: 'Dancing and having fun with everyone',
        icon: Users,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Deep conversation in a quiet corner',
        icon: Heart,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Helping the host with party tasks',
        icon: Target,
        color: 'from-green-500 to-emerald-500',
      },
    ],
  },

  {
    id: 'learning-style',
    type: 'multiple-choice',
    question: 'How do you prefer to learn new things?',
    subtitle: 'Choose your natural learning approach',
    icon: Brain,
    category: 'learning',
    tags: ['learning', 'education', 'style'],
    weight: 3,
    options: [
      {
        text: 'Hands-on practice and experimentation',
        icon: Zap,
        color: 'from-orange-500 to-red-500',
      },
      {
        text: 'Reading and researching thoroughly',
        icon: Book,
        color: 'from-blue-500 to-indigo-500',
      },
      {
        text: 'Watching videos and demonstrations',
        icon: Camera,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Discussion and collaboration with others',
        icon: Users,
        color: 'from-green-500 to-emerald-500',
      },
    ],
  },

  {
    id: 'risk-tolerance',
    type: 'slider',
    question: 'How comfortable are you with taking risks?',
    subtitle: 'In general life decisions and opportunities',
    icon: Mountain,
    category: 'risk',
    tags: ['risk', 'comfort', 'decisions'],
    weight: 4,
    min: 0,
    max: 100,
    leftLabel: 'Very Cautious',
    rightLabel: 'Risk Taker',
  },

  {
    id: 'competition-attitude',
    type: 'multiple-choice',
    question: 'How do you feel about competitive situations?',
    subtitle: 'Your natural response to competition',
    icon: Star,
    category: 'competition',
    tags: ['competition', 'attitude', 'performance'],
    weight: 3,
    options: [
      {
        text: 'I thrive on competition and love to win',
        icon: Star,
        color: 'from-yellow-500 to-orange-500',
      },
      {
        text: 'Competition motivates me to improve',
        icon: Target,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'I prefer collaborative over competitive',
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Competition makes me uncomfortable',
        icon: Heart,
        color: 'from-purple-500 to-violet-500',
      },
    ],
  },

  {
    id: 'nature-vs-city',
    type: 'multiple-choice',
    question: 'Where do you feel most at peace?',
    subtitle: 'Choose your ideal environment',
    icon: TreePine,
    category: 'environment',
    tags: ['nature', 'city', 'peace'],
    weight: 3,
    options: [
      {
        text: 'Deep in a forest or mountains',
        icon: TreePine,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'By the ocean or a lake',
        icon: Waves,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'In a bustling city center',
        icon: Users,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'In my own cozy space',
        icon: Home,
        color: 'from-orange-500 to-amber-500',
      },
    ],
  },

  {
    id: 'conflict-resolution',
    type: 'multiple-choice',
    question: 'When faced with conflict, you typically:',
    subtitle: 'Your natural conflict response',
    icon: Heart,
    category: 'conflict',
    tags: ['conflict', 'resolution', 'communication'],
    weight: 4,
    options: [
      {
        text: 'Address it directly and immediately',
        icon: Zap,
        color: 'from-red-500 to-orange-500',
      },
      {
        text: 'Try to find a compromise that works for everyone',
        icon: Users,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'Take time to think before responding',
        icon: Brain,
        color: 'from-blue-500 to-indigo-500',
      },
      {
        text: 'Avoid conflict when possible',
        icon: Home,
        color: 'from-purple-500 to-violet-500',
      },
    ],
  },

  {
    id: 'concert-preference',
    type: 'multiple-choice',
    question: 'What type of musical experience excites you most?',
    subtitle: 'Think about your ideal musical event',
    icon: Mic,
    category: 'music',
    tags: ['concert', 'music', 'experience'],
    weight: 3,
    options: [
      {
        text: 'Massive festival with thousands of people',
        icon: Users,
        color: 'from-red-500 to-pink-500',
      },
      {
        text: 'Intimate acoustic performance',
        icon: Guitar,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'High-energy club or electronic show',
        icon: Zap,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Classical or jazz in a concert hall',
        icon: Piano,
        color: 'from-blue-500 to-indigo-500',
      },
    ],
  },

  {
    id: 'music-nostalgia',
    type: 'slider',
    question:
      'Do you prefer discovering new music or listening to familiar favorites?',
    subtitle: 'Your balance between new and nostalgic',
    icon: Heart,
    category: 'music',
    tags: ['music', 'nostalgia', 'discovery'],
    weight: 3,
    min: 0,
    max: 100,
    leftLabel: 'Always New',
    rightLabel: 'Familiar Favorites',
  },

  {
    id: 'spontaneity-level',
    type: 'slider',
    question: 'How spontaneous are you in daily life?',
    subtitle: 'Planning vs. going with the flow',
    icon: Zap,
    category: 'planning',
    tags: ['spontaneity', 'planning', 'flexibility'],
    weight: 3,
    min: 0,
    max: 100,
    leftLabel: 'Always Planned',
    rightLabel: 'Completely Spontaneous',
  },

  {
    id: 'technology-adoption',
    type: 'multiple-choice',
    question: 'How do you approach new technology?',
    subtitle: 'Your relationship with tech trends',
    icon: Gamepad2,
    category: 'technology',
    tags: ['technology', 'adoption', 'trends'],
    weight: 2,
    options: [
      {
        text: 'First in line for the latest gadgets',
        icon: Star,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Adopt when it proves useful',
        icon: Target,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'Wait until everyone else has it',
        icon: Users,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Prefer to stick with what works',
        icon: Home,
        color: 'from-orange-500 to-amber-500',
      },
    ],
  },

  {
    id: 'travel-style',
    type: 'multiple-choice',
    question: "What's your ideal vacation style?",
    subtitle: 'How you like to explore and relax',
    icon: Plane,
    category: 'travel',
    tags: ['travel', 'vacation', 'exploration'],
    weight: 3,
    options: [
      {
        text: 'Adventure and extreme sports',
        icon: Mountain,
        color: 'from-red-500 to-orange-500',
      },
      {
        text: 'Cultural immersion and local experiences',
        icon: MapPin,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Relaxation and luxury resorts',
        icon: Home,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Road trips and spontaneous discoveries',
        icon: Car,
        color: 'from-green-500 to-emerald-500',
      },
    ],
  },

  {
    id: 'communication-style',
    type: 'multiple-choice',
    question: 'How do you prefer to communicate important news?',
    subtitle: 'Your natural communication preference',
    icon: Mic,
    category: 'communication',
    tags: ['communication', 'style', 'preference'],
    weight: 3,
    options: [
      {
        text: 'Face-to-face conversation',
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Phone or video call',
        icon: Volume2,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'Text message or email',
        icon: Book,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Social media or group chat',
        icon: Users,
        color: 'from-pink-500 to-rose-500',
      },
    ],
  },

  {
    id: 'emotional-processing',
    type: 'multiple-choice',
    question: 'When dealing with strong emotions, you tend to:',
    subtitle: 'Your emotional processing style',
    icon: Heart,
    category: 'emotional',
    tags: ['emotions', 'processing', 'coping'],
    weight: 4,
    options: [
      {
        text: 'Express them immediately',
        icon: Zap,
        color: 'from-red-500 to-orange-500',
      },
      {
        text: 'Talk through them with someone',
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Process them internally first',
        icon: Brain,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Distract myself until they pass',
        icon: Gamepad2,
        color: 'from-green-500 to-emerald-500',
      },
    ],
  },

  {
    id: 'perfectionism-level',
    type: 'slider',
    question: 'How much of a perfectionist are you?',
    subtitle: 'Your attention to detail and standards',
    icon: Target,
    category: 'perfectionism',
    tags: ['perfectionism', 'standards', 'detail'],
    weight: 3,
    min: 0,
    max: 100,
    leftLabel: 'Good Enough Works',
    rightLabel: 'Everything Must Be Perfect',
  },

  {
    id: 'leadership-style',
    type: 'multiple-choice',
    question: 'In group projects, you naturally:',
    subtitle: 'Your role in team dynamics',
    icon: Star,
    category: 'leadership',
    tags: ['leadership', 'teamwork', 'groups'],
    weight: 3,
    options: [
      {
        text: 'Take charge and delegate tasks',
        icon: Star,
        color: 'from-yellow-500 to-orange-500',
      },
      {
        text: 'Contribute ideas and facilitate discussion',
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Focus on executing tasks well',
        icon: Target,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'Support others and maintain harmony',
        icon: Heart,
        color: 'from-purple-500 to-violet-500',
      },
    ],
  },

  {
    id: 'attention-to-detail',
    type: 'multiple-choice',
    question: 'When reading or watching something, you:',
    subtitle: 'Your information processing style',
    icon: Book,
    category: 'attention',
    tags: ['attention', 'detail', 'processing'],
    weight: 2,
    options: [
      {
        text: 'Notice every small detail and nuance',
        icon: Target,
        color: 'from-blue-500 to-indigo-500',
      },
      {
        text: 'Focus on the main themes and messages',
        icon: Brain,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Look for practical applications',
        icon: Zap,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'Enjoy the overall experience',
        icon: Heart,
        color: 'from-pink-500 to-rose-500',
      },
    ],
  },

  {
    id: 'change-adaptation',
    type: 'slider',
    question: 'How do you typically react to unexpected changes?',
    subtitle: 'Your adaptability to change',
    icon: Zap,
    category: 'adaptability',
    tags: ['change', 'adaptability', 'flexibility'],
    weight: 4,
    min: 0,
    max: 100,
    leftLabel: 'Resist Change',
    rightLabel: 'Embrace Change',
  },

  {
    id: 'humor-style',
    type: 'multiple-choice',
    question: 'What type of humor do you gravitate toward?',
    subtitle: 'Your comedy preferences',
    icon: PartyPopper,
    category: 'humor',
    tags: ['humor', 'comedy', 'personality'],
    weight: 2,
    options: [
      {
        text: 'Witty wordplay and clever jokes',
        icon: Brain,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Physical comedy and silly situations',
        icon: PartyPopper,
        color: 'from-yellow-500 to-orange-500',
      },
      {
        text: 'Sarcasm and dry humor',
        icon: Zap,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Wholesome and uplifting humor',
        icon: Heart,
        color: 'from-green-500 to-emerald-500',
      },
    ],
  },

  {
    id: 'energy-management',
    type: 'multiple-choice',
    question: 'When your energy is low, what helps you recharge?',
    subtitle: 'Your personal energy restoration method',
    icon: Sparkles,
    category: 'energy',
    tags: ['energy', 'recharge', 'restoration'],
    weight: 3,
    options: [
      {
        text: 'Spending time with energetic people',
        icon: Users,
        color: 'from-pink-500 to-rose-500',
      },
      {
        text: 'Engaging in physical activity',
        icon: Dumbbell,
        color: 'from-red-500 to-orange-500',
      },
      {
        text: 'Having quiet time alone',
        icon: Home,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Doing something creative',
        icon: Palette,
        color: 'from-purple-500 to-violet-500',
      },
    ],
  },

  {
    id: 'goal-setting-style',
    type: 'multiple-choice',
    question: 'How do you approach setting and achieving goals?',
    subtitle: 'Your goal-oriented behavior',
    icon: Target,
    category: 'goals',
    tags: ['goals', 'achievement', 'planning'],
    weight: 3,
    options: [
      {
        text: 'Set detailed plans with specific milestones',
        icon: Target,
        color: 'from-blue-500 to-indigo-500',
      },
      {
        text: 'Set big picture goals and adapt along the way',
        icon: Mountain,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'Focus on daily habits rather than outcomes',
        icon: Clock,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Work toward goals as opportunities arise',
        icon: Sparkles,
        color: 'from-yellow-500 to-orange-500',
      },
    ],
  },

  {
    id: 'information-sharing',
    type: 'multiple-choice',
    question: 'When you learn something interesting, you:',
    subtitle: 'How you handle new information',
    icon: Book,
    category: 'information',
    tags: ['information', 'sharing', 'learning'],
    weight: 2,
    options: [
      {
        text: 'Immediately share it with others',
        icon: Users,
        color: 'from-pink-500 to-rose-500',
      },
      {
        text: 'Research more before discussing',
        icon: Brain,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Keep it to yourself unless asked',
        icon: Home,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Find ways to apply it practically',
        icon: Target,
        color: 'from-green-500 to-emerald-500',
      },
    ],
  },

  {
    id: 'time-of-day-preference',
    type: 'multiple-choice',
    question: 'When do you feel most productive and creative?',
    subtitle: 'Your natural energy rhythm',
    icon: Clock,
    category: 'time',
    tags: ['time', 'productivity', 'rhythm'],
    weight: 2,
    options: [
      {
        text: 'Early morning (5-9 AM)',
        icon: Sun,
        color: 'from-yellow-500 to-orange-500',
      },
      {
        text: 'Mid-morning to afternoon (9 AM-3 PM)',
        icon: Coffee,
        color: 'from-amber-500 to-orange-500',
      },
      {
        text: 'Evening (3-9 PM)',
        icon: Zap,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Late night (9 PM-1 AM)',
        icon: Moon,
        color: 'from-blue-500 to-cyan-500',
      },
    ],
  },

  {
    id: 'music-volume-preference',
    type: 'slider',
    question: 'How loud do you typically listen to music?',
    subtitle: 'Your preferred volume level',
    icon: Volume2,
    category: 'music',
    tags: ['music', 'volume', 'listening'],
    weight: 2,
    min: 0,
    max: 100,
    leftLabel: 'Soft Background',
    rightLabel: 'Maximum Volume',
  },

  {
    id: 'music-sharing-behavior',
    type: 'multiple-choice',
    question: 'When you discover amazing music, you:',
    subtitle: 'Your music sharing tendencies',
    icon: Radio,
    category: 'music',
    tags: ['music', 'sharing', 'discovery'],
    weight: 2,
    options: [
      {
        text: 'Immediately send it to friends',
        icon: Users,
        color: 'from-pink-500 to-rose-500',
      },
      {
        text: 'Add it to shared playlists',
        icon: Heart,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Keep it as your personal treasure',
        icon: Star,
        color: 'from-yellow-500 to-orange-500',
      },
      {
        text: 'Post about it on social media',
        icon: Mic,
        color: 'from-blue-500 to-cyan-500',
      },
    ],
  },

  {
    id: 'music-multitasking',
    type: 'multiple-choice',
    question: 'When do you listen to music most often?',
    subtitle: 'Your music listening habits',
    icon: Headphones,
    category: 'music',
    tags: ['music', 'multitasking', 'habits'],
    weight: 2,
    options: [
      {
        text: 'While working or studying',
        icon: Book,
        color: 'from-blue-500 to-indigo-500',
      },
      {
        text: 'During commutes and travel',
        icon: Car,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'As dedicated listening sessions',
        icon: Headphones,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'During exercise and activities',
        icon: Dumbbell,
        color: 'from-red-500 to-orange-500',
      },
    ],
  },

  {
    id: 'weekend-activity-preference',
    type: 'multiple-choice',
    question: 'How do you prefer to spend a free Saturday?',
    subtitle: 'Your ideal weekend activity',
    icon: Calendar,
    category: 'lifestyle',
    tags: ['weekend', 'leisure', 'activities'],
    weight: 3,
    options: [
      {
        text: 'Exploring somewhere new in your city',
        icon: MapPin,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'Having people over for games or dinner',
        icon: Users,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Working on personal projects or hobbies',
        icon: Palette,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Relaxing and catching up on entertainment',
        icon: Home,
        color: 'from-orange-500 to-amber-500',
      },
    ],
  },

  {
    id: 'decision-speed',
    type: 'slider',
    question: 'How quickly do you typically make decisions?',
    subtitle: 'Your decision-making pace',
    icon: Zap,
    category: 'decisions',
    tags: ['decisions', 'speed', 'thinking'],
    weight: 3,
    min: 0,
    max: 100,
    leftLabel: 'Very Deliberate',
    rightLabel: 'Quick Decisions',
  },

  {
    id: 'feedback-preference',
    type: 'multiple-choice',
    question: 'How do you prefer to receive feedback?',
    subtitle: 'Your feedback reception style',
    icon: Target,
    category: 'feedback',
    tags: ['feedback', 'communication', 'growth'],
    weight: 3,
    options: [
      {
        text: 'Direct and straightforward',
        icon: Zap,
        color: 'from-red-500 to-orange-500',
      },
      {
        text: 'Balanced with positive and constructive points',
        icon: Heart,
        color: 'from-green-500 to-emerald-500',
      },
      {
        text: 'In private, one-on-one settings',
        icon: Users,
        color: 'from-blue-500 to-cyan-500',
      },
      {
        text: 'Written format I can review later',
        icon: Book,
        color: 'from-purple-500 to-violet-500',
      },
    ],
  },

  {
    id: 'routine-flexibility',
    type: 'slider',
    question: 'How important are daily routines to you?',
    subtitle: 'Structure vs. flexibility in daily life',
    icon: Clock,
    category: 'routine',
    tags: ['routine', 'structure', 'flexibility'],
    weight: 3,
    min: 0,
    max: 100,
    leftLabel: 'Highly Flexible',
    rightLabel: 'Need Structure',
  },

  {
    id: 'celebration-style',
    type: 'multiple-choice',
    question: 'How do you like to celebrate achievements?',
    subtitle: 'Your celebration preferences',
    icon: PartyPopper,
    category: 'celebration',
    tags: ['celebration', 'achievement', 'social'],
    weight: 2,
    options: [
      {
        text: 'Big party with lots of people',
        icon: PartyPopper,
        color: 'from-pink-500 to-rose-500',
      },
      {
        text: 'Intimate dinner with close friends/family',
        icon: Users,
        color: 'from-purple-500 to-violet-500',
      },
      {
        text: 'Treat myself to something special',
        icon: Star,
        color: 'from-yellow-500 to-orange-500',
      },
      {
        text: 'Quiet personal reflection and gratitude',
        icon: Heart,
        color: 'from-blue-500 to-cyan-500',
      },
    ],
  },

  {
    id: 'personal-values',
    type: 'text',
    question: 'What are the three most important values that guide your life?',
    subtitle: 'Share what matters most to you',
    icon: Heart,
    category: 'values',
    tags: ['values', 'beliefs', 'core'],
    weight: 4,
    placeholder: 'e.g., Family, Creativity, Adventure...',
  },

  {
    id: 'ideal-day-description',
    type: 'text',
    question: 'Describe your perfect day from start to finish:',
    subtitle: 'Paint a picture of your ideal 24 hours',
    icon: Sun,
    category: 'lifestyle',
    tags: ['ideal', 'day', 'lifestyle'],
    weight: 3,
    placeholder: 'Wake up at... then I would... ending with...',
  },

  {
    id: 'music-memory',
    type: 'text',
    question:
      'Share a powerful memory associated with a song or musical moment:',
    subtitle: 'Music and memory connection',
    icon: Heart,
    category: 'music',
    tags: ['music', 'memory', 'emotional'],
    weight: 3,
    placeholder:
      'The first time I heard... or when this song reminded me of...',
  },

  {
    id: 'biggest-fear',
    type: 'text',
    question:
      'What is something you would love to try but fear holds you back from?',
    subtitle: 'Exploring courage and growth',
    icon: Mountain,
    category: 'growth',
    tags: ['fear', 'growth', 'courage'],
    weight: 3,
    placeholder: 'I would love to try... but I worry that...',
  },

  {
    id: 'legacy-impact',
    type: 'text',
    question: 'How do you want to be remembered by the people closest to you?',
    subtitle: 'Your desired impact and legacy',
    icon: Star,
    category: 'legacy',
    tags: ['legacy', 'impact', 'relationships'],
    weight: 4,
    placeholder: 'I want to be remembered as someone who...',
  },
];

export const CORE_QUESTIONS = [
  'social-energy',
  'decision-making',
  'music-discovery',
  'creativity-level',
];

export function getQuestionById(id: string): Question | undefined {
  return QUESTION_POOL.find((q) => q.id === id);
}

export function getQuestionsByCategory(category: string): Question[] {
  return QUESTION_POOL.filter((q) => q.category === category);
}

export function getQuestionsWithTags(tags: string[]): Question[] {
  return QUESTION_POOL.filter((q) => tags.some((tag) => q.tags.includes(tag)));
}

export function getFreeResponseQuestions(): Question[] {
  return QUESTION_POOL.filter((q) => q.type === 'text');
}

export function getQuestionsByType(type: string): Question[] {
  return QUESTION_POOL.filter((q) => q.type === type);
}

export function getHighestWeightQuestions(count: number = 10): Question[] {
  return QUESTION_POOL.sort((a, b) => b.weight - a.weight).slice(0, count);
}

export function getCategoryDistribution(): Record<string, number> {
  const distribution: Record<string, number> = {};
  QUESTION_POOL.forEach((q) => {
    distribution[q.category] = (distribution[q.category] || 0) + 1;
  });
  return distribution;
}

export function getNextQuestions(
  answers: Record<string, any>,
  currentQuestionIndex: number,
  totalQuestions: number = 10
): string[] {
  const usedQuestions = new Set<string>();
  const selectedQuestions: string[] = [];

  for (const coreQuestionId of CORE_QUESTIONS) {
    if (selectedQuestions.length < totalQuestions) {
      selectedQuestions.push(coreQuestionId);
      usedQuestions.add(coreQuestionId);
    }
  }

  if (selectedQuestions.length < totalQuestions) {
    const freeResponseQuestions = QUESTION_POOL.filter(
      (q) => q.type === 'text'
    ).map((q) => q.id);

    const availableQuestions = QUESTION_POOL.filter(
      (q) => !usedQuestions.has(q.id) && !freeResponseQuestions.includes(q.id)
    );

    const routingQuestions = getRoutedQuestions(
      answers,
      availableQuestions,
      usedQuestions
    );
    for (const questionId of routingQuestions) {
      if (
        selectedQuestions.length < totalQuestions &&
        !usedQuestions.has(questionId)
      ) {
        selectedQuestions.push(questionId);
        usedQuestions.add(questionId);
      }
    }

    const remainingSlots = totalQuestions - selectedQuestions.length;
    if (remainingSlots > 1) {
      const varietyQuestions = getVarietyQuestions(
        availableQuestions.filter((q) => !usedQuestions.has(q.id)),
        remainingSlots - 1,
        usedQuestions
      );
      for (const questionId of varietyQuestions) {
        if (selectedQuestions.length < totalQuestions) {
          selectedQuestions.push(questionId);
          usedQuestions.add(questionId);
        }
      }
    }

    if (selectedQuestions.length < totalQuestions) {
      const availableFreeResponse = freeResponseQuestions.filter(
        (id) => !usedQuestions.has(id)
      );

      if (availableFreeResponse.length > 0) {
        const randomFreeResponse =
          availableFreeResponse[
            Math.floor(Math.random() * availableFreeResponse.length)
          ];
        selectedQuestions.push(randomFreeResponse);
        usedQuestions.add(randomFreeResponse);
      }
    }

    while (selectedQuestions.length < totalQuestions) {
      const remainingQuestions = QUESTION_POOL.filter(
        (q) => !usedQuestions.has(q.id)
      );
      if (remainingQuestions.length === 0) break;

      const nextQuestion = remainingQuestions[0];
      selectedQuestions.push(nextQuestion.id);
      usedQuestions.add(nextQuestion.id);
    }
  }

  return selectedQuestions.slice(0, totalQuestions);
}

function getRoutedQuestions(
  answers: Record<string, any>,
  availableQuestions: Question[],
  usedQuestions: Set<string>
): string[] {
  const routedQuestions: string[] = [];

  if (answers['social-energy']) {
    if (
      answers['social-energy'].includes('party') ||
      answers['social-energy'].includes('friends')
    ) {
      routedQuestions.push(
        ...getQuestionsFromCategories(
          ['social', 'communication', 'celebration'],
          availableQuestions,
          usedQuestions,
          2
        )
      );
    } else {
      routedQuestions.push(
        ...getQuestionsFromCategories(
          ['emotional', 'energy', 'routine'],
          availableQuestions,
          usedQuestions,
          2
        )
      );
    }
  }

  if (answers['decision-making'] !== undefined) {
    if (answers['decision-making'] < 30) {
      routedQuestions.push(
        ...getQuestionsFromCategories(
          ['planning', 'perfectionism', 'attention', 'feedback'],
          availableQuestions,
          usedQuestions,
          2
        )
      );
    } else if (answers['decision-making'] > 70) {
      routedQuestions.push(
        ...getQuestionsFromCategories(
          ['adaptability', 'humor', 'spontaneity'],
          availableQuestions,
          usedQuestions,
          2
        )
      );
    } else {
      routedQuestions.push(
        ...getQuestionsFromCategories(
          ['decisions', 'goals'],
          availableQuestions,
          usedQuestions,
          1
        )
      );
    }
  }

  if (answers['music-discovery']) {
    if (
      answers['music-discovery'].includes('recommendations') ||
      answers['music-discovery'].includes('social')
    ) {
      routedQuestions.push(
        ...getQuestionsFromCategories(
          ['music', 'information'],
          availableQuestions,
          usedQuestions,
          2
        )
      );
    } else {
      routedQuestions.push(
        ...getQuestionsFromCategories(
          ['music'],
          availableQuestions,
          usedQuestions,
          1
        )
      );
    }
  }

  if (answers['creativity-level'] !== undefined) {
    if (answers['creativity-level'] > 60) {
      routedQuestions.push(
        ...getQuestionsFromCategories(
          ['humor', 'learning', 'technology'],
          availableQuestions,
          usedQuestions,
          1
        )
      );
    } else {
      routedQuestions.push(
        ...getQuestionsFromCategories(
          ['routine', 'time'],
          availableQuestions,
          usedQuestions,
          1
        )
      );
    }
  }

  return [...new Set(routedQuestions)].slice(0, 5);
}

function getVarietyQuestions(
  availableQuestions: Question[],
  count: number,
  usedQuestions: Set<string>
): string[] {
  const highWeightQuestions = availableQuestions
    .filter((q) => q.weight >= 3 && !usedQuestions.has(q.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, count);

  return highWeightQuestions.map((q) => q.id);
}

function getQuestionsFromCategories(
  categories: string[],
  availableQuestions: Question[],
  usedQuestions: Set<string>,
  maxCount: number
): string[] {
  const categoryQuestions = availableQuestions
    .filter((q) => categories.includes(q.category) && !usedQuestions.has(q.id))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, maxCount);

  return categoryQuestions.map((q) => q.id);
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Zap,
  Coffee,
  Home,
  Brain,
  Palette,
  Target,
  Music,
  Sparkles,
} from 'lucide-react';

interface Question {
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
}

const questions: Question[] = [
  {
    id: 'social-energy',
    type: 'multiple-choice',
    question: 'How do you prefer to spend your ideal weekend?',
    subtitle: 'Choose the scenario that energizes you most',
    icon: Users,
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
    placeholder:
      'e.g., Travel the world, Start my own business, Make a difference...',
  },
];

export default function OnboardingStep() {
  const router = useRouter();
  const params = useParams();
  const step = Number.parseInt(params.step as string);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentAnswer, setCurrentAnswer] = useState<any>('');

  const currentQuestion = questions[step - 1];
  const totalSteps = questions.length;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    const savedAnswers = localStorage.getItem('personality-answers');
    if (savedAnswers) {
      const parsed = JSON.parse(savedAnswers);
      setAnswers(parsed);
      setCurrentAnswer(parsed[currentQuestion?.id] || '');
    }
  }, [currentQuestion?.id]);

  const handleNext = () => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
    setAnswers(updatedAnswers);
    localStorage.setItem('personality-answers', JSON.stringify(updatedAnswers));

    if (step < totalSteps) {
      router.push(`/onboarding/${step + 1}`);
    } else {
      router.push('/results');
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      router.push(`/onboarding/${step - 1}`);
    } else {
      router.push('/');
    }
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  const IconComponent = currentQuestion.icon;

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3 md:space-y-4">
            {currentQuestion.options?.map((option, index) => {
              const OptionIcon = option.icon;
              const isSelected = currentAnswer === option.text;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className={`group w-full p-4 md:p-6 h-auto text-left justify-start relative overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? `bg-gradient-to-r ${option.color} text-white border-0 shadow-xl scale-105`
                      : 'border-2 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800/50 hover:scale-102'
                  }`}
                  onClick={() => setCurrentAnswer(option.text)}
                >
                  <div className="flex items-start gap-3 md:gap-4 relative z-10 w-full">
                    <div
                      className={`p-2 md:p-3 rounded-xl transition-all duration-300 flex-shrink-0 ${
                        isSelected
                          ? 'bg-white/20'
                          : 'bg-slate-700 group-hover:bg-slate-600'
                      }`}
                    >
                      <OptionIcon className="w-5 md:w-6 h-5 md:h-6" />
                    </div>
                    <span className="text-sm md:text-lg font-medium leading-relaxed whitespace-normal break-words flex-1">
                      {option.text}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
                  )}
                </Button>
              );
            })}
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-6 md:space-y-8 px-2">
            <div className="relative">
              <Slider
                value={[currentAnswer || 50]}
                onValueChange={(value) => setCurrentAnswer(value[0])}
                max={100}
                step={1}
                className="w-full h-2 md:h-3"
              />
              <div className="absolute -top-10 md:-top-12 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-sm md:text-lg font-bold shadow-lg">
                  {currentAnswer || 50}
                </div>
              </div>
            </div>
            <div className="flex justify-between text-slate-400 font-medium text-sm md:text-base">
              <span className="flex items-center gap-1 md:gap-2">
                <Brain className="w-4 md:w-5 h-4 md:h-5" />
                {currentQuestion.leftLabel}
              </span>
              <span className="flex items-center gap-1 md:gap-2">
                <Sparkles className="w-4 md:w-5 h-4 md:h-5" />
                {currentQuestion.rightLabel}
              </span>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-3 md:space-y-4">
            <Textarea
              placeholder={currentQuestion.placeholder}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="w-full bg-slate-800/50 border-2 border-slate-700 text-white placeholder-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 rounded-xl p-4 md:p-6 text-sm md:text-lg leading-relaxed resize-none transition-all duration-300"
              rows={3}
            />
            <p className="text-slate-500 text-xs md:text-sm">
              Express yourself authentically - there are no wrong answers!
            </p>
          </div>
        );

      case 'image-selection':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {currentQuestion.images?.map((image, index) => {
              const ImageIcon = image.icon;
              const isSelected = currentAnswer === image.label;
              return (
                <Card
                  key={index}
                  className={`group cursor-pointer transition-all duration-500 overflow-hidden ${
                    isSelected
                      ? 'ring-4 ring-pink-400 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 scale-105 shadow-2xl'
                      : 'bg-slate-800/50 hover:bg-slate-700/50 hover:scale-102 border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => setCurrentAnswer(image.label)}
                >
                  <CardContent className="p-4 md:p-6">
                    <div className="relative mb-3 md:mb-4 overflow-hidden rounded-xl">
                      <Image
                        src={image.src}
                        alt={image.label}
                        width={300}
                        height={160}
                        className="w-full h-32 md:h-40 object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={step === 4} // Preload images for the image selection step
                      />
                      <div
                        className={`absolute inset-0 transition-opacity duration-300 ${
                          isSelected
                            ? 'bg-gradient-to-br from-pink-500/30 to-cyan-500/30'
                            : 'bg-black/20 group-hover:bg-black/10'
                        }`}
                      ></div>
                      <div
                        className={`absolute top-3 md:top-4 right-3 md:right-4 p-1.5 md:p-2 rounded-full transition-all duration-300 ${
                          isSelected
                            ? 'bg-white text-pink-500'
                            : 'bg-slate-800/80 text-white'
                        }`}
                      >
                        <ImageIcon className="w-4 md:w-5 h-4 md:h-5" />
                      </div>
                    </div>
                    <p
                      className={`text-center font-semibold text-sm md:text-lg transition-colors duration-300 ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {image.label}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-10 left-10 text-pink-400/20 animate-bounce delay-300">
          <Music className="w-6 h-6" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4 md:p-8">
        {/* Enhanced Progress Section */}
        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-xl">
                <IconComponent className="w-5 md:w-6 h-5 md:h-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs md:text-sm font-medium">
                  Question {step} of {totalSteps}
                </p>
                <p className="text-white text-sm md:text-lg font-semibold">
                  {Math.round(progress)}% Complete
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs md:text-sm">Almost there!</p>
              <p className="text-cyan-400 font-medium text-xs md:text-base">
                Keep going 🎵
              </p>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex gap-1 md:gap-2 mb-3 md:mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 md:h-2 flex-1 rounded-full transition-all duration-500 ${
                  i < step
                    ? 'bg-gradient-to-r from-pink-500 to-cyan-500'
                    : i === step - 1
                    ? 'bg-gradient-to-r from-pink-500 to-cyan-500 animate-pulse'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <Progress
            value={progress}
            className="h-2 md:h-3 bg-slate-800 rounded-full overflow-hidden"
          >
            <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 transition-all duration-1000 ease-out rounded-full relative">
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </Progress>
        </div>

        {/* Question Card */}
        <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-xl mb-8 md:mb-12 overflow-hidden">
          <CardHeader className="pb-4 md:pb-8">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-pink-500/20 to-cyan-500/20 rounded-2xl border border-pink-500/20 flex-shrink-0">
                <IconComponent className="w-6 md:w-8 h-6 md:h-8 text-pink-400" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl md:text-3xl lg:text-4xl text-white leading-tight mb-2 md:mb-3 font-bold">
                  {currentQuestion.question}
                </CardTitle>
                {currentQuestion.subtitle && (
                  <p className="text-slate-400 text-sm md:text-lg leading-relaxed">
                    {currentQuestion.subtitle}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-6 md:pb-8">
            {renderQuestion()}
          </CardContent>
        </Card>

        {/* Enhanced Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <Button
            variant="outline"
            onClick={handlePrevious}
            className={`group border-2 border-slate-600 text-slate-300 hover:border-pink-400 hover:text-white bg-slate-800/50 backdrop-blur-sm px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-medium rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto order-2 sm:order-1 ${
              step === 1 ? 'hidden sm:flex' : 'flex'
            }`}
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
            {step === 1 ? 'Home' : 'Back'}
          </Button>

          <Button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="group relative bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold px-6 sm:px-12 py-3 sm:py-4 text-sm sm:text-lg rounded-xl shadow-xl hover:shadow-pink-500/30 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden w-full sm:w-auto order-1 sm:order-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center">
              <span className="mr-2 sm:mr-3">
                {step === totalSteps ? 'Get Results' : 'Next'}
              </span>
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </div>
            <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          </Button>
        </div>
      </div>
    </div>
  );
}

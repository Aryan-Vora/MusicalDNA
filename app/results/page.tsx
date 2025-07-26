'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Music,
  RefreshCw,
  Home,
  ExternalLink,
  Play,
  Heart,
  Sparkles,
  Headphones,
  Star,
  Loader2,
} from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  embedUrl: string;
  previewUrl?: string;
  imageUrl?: string;
  reason: string;
  personalityMatch: string[];
  mood: string;
  energy: 'High' | 'Medium' | 'Low';
  spotifyUrl: string;
}

interface PersonalityAnalysis {
  type: string;
  description: string;
  traits: string[];
  musicPreferences: {
    genres: string[];
    energy: number;
    valence: number;
    danceability: number;
    acousticness: number;
  };
}

interface ApiResponse {
  personalityAnalysis: PersonalityAnalysis;
  songs: Song[];
}

const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    embedUrl: 'https://open.spotify.com/embed/track/0VjIjW4GlULA4LGoDOLVKN',
    spotifyUrl: 'https://open.spotify.com/track/0VjIjW4GlULA4LGoDOLVKN',
    reason:
      'Your adventurous spirit and high energy levels align perfectly with this upbeat, synth-driven anthem that captures the thrill of nighttime adventures.',
    personalityMatch: ['High Energy', 'Adventure Seeker', 'Modern Vibes'],
    mood: 'Energetic',
    energy: 'High',
  },
  {
    id: '2',
    title: 'Weightless',
    artist: 'Marconi Union',
    embedUrl: 'https://open.spotify.com/embed/track/6p0Q6KeqVbKVhHlcQkiCwd',
    spotifyUrl: 'https://open.spotify.com/track/6p0Q6KeqVbKVhHlcQkiCwd',
    reason:
      'Based on your preference for calm environments and introspective nature, this scientifically-designed relaxing track perfectly matches your need for mental clarity and peace.',
    personalityMatch: ['Introspective', 'Calm Seeker', 'Mindful'],
    mood: 'Peaceful',
    energy: 'Low',
  },
  {
    id: '3',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    embedUrl: 'https://open.spotify.com/embed/track/4ZtFanR9U6ndgddUvNcjcG',
    spotifyUrl: 'https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG',
    reason:
      'Your expressive personality and emotional depth connect with this raw, authentic pop-rock energy that channels feelings into powerful musical expression.',
    personalityMatch: ['Emotionally Expressive', 'Authentic', 'Creative'],
    mood: 'Empowering',
    energy: 'High',
  },
  {
    id: '4',
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    embedUrl: 'https://open.spotify.com/embed/track/2NqJlkAec8DjOUhSjmyrdg',
    spotifyUrl: 'https://open.spotify.com/track/2NqJlkAec8DjOUhSjmyrdg',
    reason:
      'Your appreciation for beauty and contemplative moments makes this timeless classical piece a perfect match for your reflective and aesthetic nature.',
    personalityMatch: [
      'Contemplative',
      'Aesthetic Appreciation',
      'Depth Seeker',
    ],
    mood: 'Reflective',
    energy: 'Low',
  },
];

export default function ResultsPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [personalityAnalysis, setPersonalityAnalysis] =
    useState<PersonalityAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedAnswers = localStorage.getItem('personality-answers');
    if (!savedAnswers) {
      router.push('/');
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const parsed = JSON.parse(savedAnswers);
        setAnswers(parsed);

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers: parsed }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to analyze personality');
        }

        const data: ApiResponse = await response.json();
        setPersonalityAnalysis(data.personalityAnalysis);
        setRecommendations(data.songs);
      } catch (error: any) {
        console.error('Error fetching analysis:', error);

        if (error?.message?.includes('AI service is currently unavailable')) {
          setError(
            'The AI service is temporarily unavailable due to quota limits. This happens when the OpenAI API has reached its usage limit. Please try again later or contact support to upgrade the service quota.'
          );
        } else if (error?.message?.includes('quota')) {
          setError(
            'AI service quota exceeded. The application has reached its OpenAI API usage limit. Please contact support to resolve this issue or try again later.'
          );
        } else {
          setError(
            'Unable to connect to the AI service. Please check your internet connection and try again later.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();
  }, [router]);

  const handleRetake = () => {
    localStorage.removeItem('personality-answers');
    router.push('/onboarding/1');
  };

  const refreshRecommendations = async () => {
    if (!answers || Object.keys(answers).length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze personality');
      }

      const data: ApiResponse = await response.json();
      setPersonalityAnalysis(data.personalityAnalysis);
      setRecommendations(data.songs);
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
      setError('Failed to refresh recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'High':
        return 'from-red-500 to-orange-500';
      case 'Medium':
        return 'from-yellow-500 to-amber-500';
      case 'Low':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-white text-center relative z-10">
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
                <Music className="w-10 h-10 text-pink-400 animate-pulse" />
              </div>
            </div>
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-lime-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Analyzing Your Musical Tastes
          </h2>
          <p className="text-xl text-slate-300 animate-pulse">
            Crafting your perfect playlist...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-lime-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-pink-400/20 animate-bounce delay-300">
          <Music className="w-8 h-8" />
        </div>
        <div className="absolute top-40 right-20 text-cyan-400/20 animate-bounce delay-700">
          <Headphones className="w-6 h-6" />
        </div>
        <div className="absolute bottom-40 left-20 text-lime-400/20 animate-bounce delay-1000">
          <Play className="w-7 h-7" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-6 md:mb-8">
            <div className="inline-flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-3 md:p-4 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-2xl">
                <Sparkles className="w-6 md:w-8 h-6 md:h-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-black bg-gradient-to-r from-pink-400 via-cyan-400 to-lime-400 bg-clip-text text-transparent">
                Your Musical DNA
              </h1>
            </div>

            <div className="mb-6 md:mb-8">
              <Badge className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white text-sm md:text-xl px-4 md:px-8 py-2 md:py-3 rounded-full font-bold shadow-2xl">
                <Star className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" />
                {personalityAnalysis?.type || 'Analyzing...'}
              </Badge>
            </div>

            <p className="text-base md:text-xl lg:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light px-4">
              {personalityAnalysis?.description ||
                'Discovering your musical personality...'}
            </p>
          </div>

          <div className="flex justify-center gap-6 md:gap-8 text-slate-400">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-pink-400">
                {recommendations.length}
              </div>
              <div className="text-xs md:text-sm">Perfect Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-cyan-400">
                100%
              </div>
              <div className="text-xs md:text-sm">Personalized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-lime-400">
                ∞
              </div>
              <div className="text-xs md:text-sm">Possibilities</div>
            </div>
          </div>
        </div>

        {/* Song Recommendations */}
        <div className="space-y-6 md:space-y-8 mb-12 md:mb-16">
          {recommendations.map((song, index) => (
            <Card
              key={song.id}
              className="group bg-slate-800/30 border-slate-700/50 backdrop-blur-xl overflow-hidden hover:bg-slate-800/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
            >
              <CardHeader className="pb-4 md:pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                      <div
                        className={`w-12 md:w-16 h-12 md:h-16 bg-gradient-to-r ${getEnergyColor(
                          song.energy
                        )} rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-2xl shadow-lg flex-shrink-0`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-xl md:text-3xl text-white mb-1 md:mb-2 group-hover:text-pink-400 transition-colors duration-300 truncate">
                          {song.title}
                        </CardTitle>
                        <p className="text-slate-400 text-sm md:text-xl font-medium truncate">
                          by {song.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                      {song.personalityMatch.map((trait, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="border-pink-400/50 text-pink-400 bg-pink-400/10 px-2 md:px-3 py-1 text-xs md:text-sm font-medium"
                        >
                          {trait}
                        </Badge>
                      ))}
                      <Badge
                        className={`bg-gradient-to-r ${getEnergyColor(
                          song.energy
                        )} text-white px-2 md:px-3 py-1 text-xs md:text-sm font-medium`}
                      >
                        {song.energy} Energy
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-cyan-400/50 text-cyan-400 bg-cyan-400/10 px-2 md:px-3 py-1 text-xs md:text-sm font-medium"
                      >
                        {song.mood}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-slate-300 mb-6 md:mb-8 leading-relaxed text-sm md:text-lg">
                  {song.reason}
                </p>

                {/* Spotify Embed */}
                <div className="bg-slate-900/50 rounded-2xl p-3 md:p-6 mb-4 md:mb-6 border border-slate-700/50">
                  <iframe
                    src={song.embedUrl}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl"
                  ></iframe>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Heart className="w-4 md:w-5 h-4 md:h-5" />
                    <span className="text-xs md:text-sm">
                      Perfect match for your personality
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group border-2 border-slate-600 text-slate-300 hover:border-pink-400 hover:text-white bg-slate-800/50 backdrop-blur-sm px-4 md:px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
                    onClick={() => window.open(song.spotifyUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Open in Spotify
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="text-center space-y-6 md:space-y-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 max-w-2xl mx-auto">
              <p className="text-red-300 text-sm md:text-base">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Button
              onClick={refreshRecommendations}
              disabled={isLoading}
              className="group bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-600 hover:to-cyan-600 text-white px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg font-medium rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isLoading ? (
                <Loader2 className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 animate-spin" />
              ) : (
                <Sparkles className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 group-hover:animate-pulse" />
              )}
              {isLoading ? 'Refreshing...' : 'Get New Recommendations'}
            </Button>

            <Button
              onClick={handleRetake}
              variant="outline"
              className="group border-2 border-slate-600 text-slate-300 hover:border-pink-400 hover:text-white bg-slate-800/50 backdrop-blur-sm px-6 md:px-8 py-3 md:py-4 text-sm md:text-lg font-medium rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <RefreshCw className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 group-hover:rotate-180 transition-transform duration-500" />
              Retake Assessment
            </Button>
          </div>

          <div className="mt-4">
            <Button
              onClick={() => router.push('/')}
              className="group bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold px-8 md:px-12 py-3 md:py-4 text-sm md:text-lg rounded-xl shadow-xl hover:shadow-pink-500/30 transition-all duration-300 transform hover:scale-110 w-full sm:w-auto"
            >
              <Home className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3 group-hover:scale-125 transition-transform duration-300" />
              Discover More Music
            </Button>
          </div>

          <div className="space-y-3 md:space-y-4">
            <p className="text-slate-400 text-sm md:text-lg">
              Love your recommendations? Share MusicalDNA with friends!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Trusted by at least 1 music lover</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-slate-500">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <span>Single digit accuracy rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Sparkles, Heart, Zap, Play, Headphones } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-lime-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Floating Music Notes */}
        <div className="absolute top-20 left-10 text-pink-400/30 animate-bounce delay-300">
          <Music className="w-8 h-8" />
        </div>
        <div className="absolute top-40 right-20 text-cyan-400/30 animate-bounce delay-700">
          <Headphones className="w-6 h-6" />
        </div>
        <div className="absolute bottom-40 left-20 text-lime-400/30 animate-bounce delay-1000">
          <Play className="w-7 h-7" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-8">
        <div className="flex items-center gap-3 text-white">
          <div className="relative">
            <Music className="w-10 h-10 text-pink-400 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-cyan-400 to-lime-400 bg-clip-text text-transparent">
            SoulSync
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-8 py-16">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-16">
            <div className="mb-8 space-y-2">
              <p className="text-cyan-400 font-medium text-lg tracking-wide uppercase">
                Discover Your Musical DNA
              </p>
              <h2 className="text-6xl md:text-8xl font-black mb-8 bg-gradient-to-r from-pink-400 via-cyan-400 to-lime-400 bg-clip-text text-transparent leading-tight tracking-tight">
                Music That Matches
                <br />
                <span className="text-white">Your Soul</span>
              </h2>
            </div>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              Discover your perfect playlist through personality insights.
              <br />
              <span className="text-pink-400 font-medium">
                No music questions, just pure you.
              </span>
            </p>
          </div>

          {/* CTA Section */}
          <div className="space-y-8 mb-16">
            <Link href="/onboarding/1">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold px-16 py-8 text-2xl rounded-2xl shadow-2xl hover:shadow-pink-500/30 transition-all duration-500 transform hover:scale-110 hover:-translate-y-2 border-0 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-4">
                  <Play className="w-8 h-8 group-hover:scale-125 transition-transform duration-300" />
                  Start Your Musical Journey
                  <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                </div>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Button>
            </Link>
            <div className="space-y-2">
              <p className="text-slate-400 text-lg">
                Takes just 2-3 minutes • No signup required
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Trusted by at least 1 music lover</span>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="group bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-pink-500/20 hover:border-pink-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Personality-Driven
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Answer fun questions about yourself, not your music taste
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Curated Just for You
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Get personalized recommendations that truly resonate
                </p>
              </CardContent>
            </Card>

            <Card className="group bg-gradient-to-br from-slate-800/80 to-purple-900/80 border-lime-500/20 hover:border-lime-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-lime-500/20 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-600 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Instant Discovery
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Quick assessment, immediate musical enlightenment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

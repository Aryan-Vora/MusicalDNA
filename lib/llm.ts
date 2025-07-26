import OpenAI from 'openai';

export interface PersonalityAnalysis {
  type: string;
  description: string;
  traits: string[];
  musicPreferences: {
    genres: string[];
    energy: number; // 0-1
    valence: number; // 0-1 (positivity)
    danceability: number; // 0-1
    acousticness: number; // 0-1
  };
}

export interface SongRecommendation {
  query: string;
  reason: string;
  personalityMatch: string[];
  mood: string;
  energy: 'High' | 'Medium' | 'Low';
}

class LLMService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    if (apiKey.startsWith('sk-') === false) {
      throw new Error('OPENAI_API_KEY invalid');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async analyzePersonality(
    answers: Record<string, any>
  ): Promise<PersonalityAnalysis> {
    const prompt = `
Analyze the following personality assessment answers and provide a comprehensive personality analysis:

Answers: ${JSON.stringify(answers, null, 2)}

Based on these answers, provide a JSON response with the following structure:
{
  "type": "A catchy personality type name (e.g., 'The Dreamy Explorer', 'The Energetic Socialite')",
  "description": "A detailed 2-3 sentence description of this personality type",
  "traits": ["Array of 5-7 key personality traits"],
  "musicPreferences": {
    "genres": ["Array of 3-5 music genres that would appeal to this personality"],
    "energy": "Number between 0-1 representing preferred energy level",
    "valence": "Number between 0-1 representing preference for positive/upbeat music",
    "danceability": "Number between 0-1 representing preference for danceable music",
    "acousticness": "Number between 0-1 representing preference for acoustic vs electronic music"
  }
}

Consider the following mapping:
- Social energy levels (introvert vs extrovert)
- Decision making style (logic vs intuition)
- Adventure level (risk-taking vs comfort-seeking)
- Work environment preferences
- Stress response methods
- Creativity importance
- And any other personality indicators in the answers

Provide only the JSON response, no additional text.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert personality psychologist and music therapist. Analyze personality traits and provide accurate music preference predictions based on psychological research.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const cleanedResponse = this.extractJsonFromMarkdown(response);
      return JSON.parse(cleanedResponse) as PersonalityAnalysis;
    } catch (error: any) {
      console.error('Error analyzing personality:', error);

      if (error?.status === 429) {
        throw new Error(
          'OpenAI API quota exceeded. Please check your billing details or try again later.'
        );
      }

      if (error?.status === 401) {
        throw new Error(
          'OpenAI API key is invalid. Please check your configuration.'
        );
      }

      if (error?.status === 400) {
        throw new Error(
          'Invalid request to OpenAI API. Please check the input data.'
        );
      }

      throw new Error('Failed to analyze personality. Please try again later.');
    }
  }

  async generateSongRecommendations(
    personalityAnalysis: PersonalityAnalysis,
    availableGenres: string[]
  ): Promise<SongRecommendation[]> {
    const prompt = `
Based on the following personality analysis, generate 6 specific song search queries for Spotify that would match this person's personality:

Personality Analysis: ${JSON.stringify(personalityAnalysis, null, 2)}

Available Spotify Genres: ${availableGenres.slice(0, 50).join(', ')}

For each recommendation, provide a JSON object with this structure:
{
  "query": "Specific search query for Spotify (include popular artist names and hit song titles when possible)",
  "reason": "2-3 sentence explanation of why this song matches their personality",
  "personalityMatch": ["Array of 2-4 personality traits this song addresses"],
  "mood": "One word mood descriptor (e.g., 'Energetic', 'Peaceful', 'Empowering', 'Reflective')",
  "energy": "High, Medium, or Low"
}

CRITICAL Guidelines - MUST FOLLOW EXACTLY:
- PRIORITIZE popular, mainstream songs and well-known artists that people actually listen to
- Use specific artist names + song titles for better results
- Include 3-4 very popular/chart-topping songs, then 2-3 slightly more niche but still well-known tracks
- Avoid obscure artists or underground music unless the personality clearly indicates that preference

ENERGY LEVEL MATCHING - ABSOLUTELY CRITICAL:
- If energy preference is LOW (0-0.4): Choose calm, mellow, acoustic, slow songs
- If energy preference is MEDIUM (0.4-0.7): Choose moderate tempo, balanced songs
- If energy preference is HIGH (0.7-1.0): Choose upbeat, fast, energetic songs

MOOD MATCHING - ABSOLUTELY CRITICAL:
- If valence is LOW (0-0.4): Choose melancholic, sad, introspective songs
- If valence is MEDIUM (0.4-0.7): Choose balanced, neutral mood songs
- If valence is HIGH (0.7-1.0): Choose happy, upbeat, positive songs

GENRE MATCHING:
- Match the suggested genres from the personality analysis
- If personality suggests folk/acoustic: Choose acoustic and folk artists
- If personality suggests rock: Choose popular rock artists
- If personality suggests pop: Choose mainstream pop artists
- If personality suggests hip-hop/rap: Choose popular rap artists (but match energy level!)

VALIDATION EXAMPLES - AVOID THESE MISTAKES:
- DO NOT suggest high-energy rap songs for low energy personalities
- DO NOT suggest aggressive metal for peaceful mood preferences
- DO NOT suggest slow ballads for high energy personalities
- DO NOT suggest death metal for someone who prefers acoustic music

Consider current and recent popular music (2018-2025) as well as timeless classics that match the energy and mood requirements.

Order your recommendations from most popular/mainstream to least popular. Provide a JSON array of exactly 6 recommendation objects, no additional text.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              "You are an expert music curator with deep knowledge of Spotify's catalog and music psychology. Create diverse, personalized music recommendations.",
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1500,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      const cleanedResponse = this.extractJsonFromMarkdown(response);
      return JSON.parse(cleanedResponse) as SongRecommendation[];
    } catch (error: any) {
      console.error('Error generating song recommendations:', error);

      if (error?.status === 429) {
        throw new Error(
          'OpenAI API quota exceeded. Please check your billing details or try again later.'
        );
      }

      if (error?.status === 401) {
        throw new Error(
          'OpenAI API key is invalid. Please check your configuration.'
        );
      }

      if (error?.status === 400) {
        throw new Error(
          'Invalid request to OpenAI API. Please check the input data.'
        );
      }

      throw new Error(
        'Failed to generate song recommendations. Please try again later.'
      );
    }
  }

  private extractJsonFromMarkdown(text: string): string {
    const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
    const codeBlockRegex = /```\s*([\s\S]*?)\s*```/;

    let match = text.match(jsonBlockRegex);
    if (match) {
      return match[1].trim();
    }

    match = text.match(codeBlockRegex);
    if (match) {
      return match[1].trim();
    }

    return text.trim();
  }
}

export const llmService = new LLMService();

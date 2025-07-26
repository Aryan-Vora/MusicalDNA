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
Based on the following personality analysis, generate 4-6 specific song search queries for Spotify that would match this person's personality:

Personality Analysis: ${JSON.stringify(personalityAnalysis, null, 2)}

Available Spotify Genres: ${availableGenres.slice(0, 50).join(', ')}

For each recommendation, provide a JSON object with this structure:
{
  "query": "Specific search query for Spotify (artist, song title, or genre + descriptors)",
  "reason": "2-3 sentence explanation of why this song matches their personality",
  "personalityMatch": ["Array of 2-4 personality traits this song addresses"],
  "mood": "One word mood descriptor (e.g., 'Energetic', 'Peaceful', 'Empowering', 'Reflective')",
  "energy": "High, Medium, or Low"
}

Guidelines:
- Include a mix of energy levels and moods
- Consider both popular and lesser-known artists
- Match genres to the personality analysis
- Ensure variety in the recommendations
- Make search queries specific enough to find actual songs

Provide a JSON array of 4-6 recommendation objects, no additional text.
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

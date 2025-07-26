# Spotify Personality App
Made this in a day lol.

A Next.js application that analyzes your personality through questionnaires and provides personalized music recommendations using AI and the Spotify API.

## Features

- **Personalized Music Recommendations**: Integrates with Spotify API to find songs that match your personality profile
- **Real-time Analysis**: Generates personalized recommendations using both AI reasoning and Spotify's recommendation engine
- **Beautiful UI**: Modern, responsive interface built with Tailwind CSS and Radix UI components
- **Rich Song Data**: Includes song previews, album artwork, and direct Spotify links
- **AI-Powered Personality Analysis**: Uses OpenAI to analyze personality traits from questionnaire responses


## How It Works

### The Analysis Process

1. **Personality Assessment**: Complete a comprehensive questionnaire covering:
   - Social energy preferences
   - Decision-making style  
   - Adventure level
   - Work environment preferences
   - Stress response patterns
   - Creativity importance

2. **AI Analysis**: OpenAI analyzes your responses to determine:
   - Your unique personality type
   - Key personality traits
   - Music preferences (genres, energy levels, mood preferences)

3. **Song Discovery**: The system then:
   - Generates specific search queries based on your personality
   - Uses Spotify's API to find matching songs
   - Applies Spotify's recommendation algorithm with your personality parameters
   - Provides detailed reasoning for each recommendation

4. **Personalized Results**: You receive:
   - A detailed personality analysis
   - 4-6 carefully curated song recommendations
   - Explanations for why each song matches your personality
   - Direct access to play songs on Spotify

## Backend Architecture

### Core Services

- **LLM Service**: OpenAI integration for personality analysis and reasoning
- **Spotify Service**: Complete Spotify Web API integration with authentication handling
- **Music Recommendation Engine**: Intelligent combination of AI insights and music data

### API Endpoints

- `POST /api/analyze` - Main personality analysis and music recommendation endpoint
- `GET /api/search/tracks` - Search Spotify's catalog
- `GET /api/genres` - Available music genres
- `GET /api/health` - Service health monitoring

### Key Features

- **Intelligent Reasoning**: Each recommendation includes AI-generated explanations
- **Diverse Discovery**: Combines human-like reasoning with algorithmic recommendations  
- **Rich Metadata**: Song images, preview URLs, and Spotify integration
- **Graceful Fallbacks**: Works even when some services are temporarily unavailable
- **Real-time Refresh**: Get new recommendations while keeping your personality analysis

## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **UI Components**: Radix UI primitives
- **Backend**: Next.js API routes with native fetch
- **AI**: OpenAI GPT-4o-mini
- **Music**: Spotify Web API (native implementation)
- **Deployment**: Built for Vercel, Netlify, or similar platforms

## The Technical Approach

### Why This Works

The core insight is that personality traits correlate strongly with musical preferences:

- **Extroverts** tend to prefer upbeat, energetic music with strong rhythms
- **Creative types** gravitate toward experimental and indie genres
- **Analytical minds** often appreciate complex compositions and progressive music
- **Adventure seekers** enjoy discovering new and diverse sounds

### The AI Integration

Rather than asking "What music do you like?", we ask "How do you handle stress?" and "What energizes you?" The AI then:

1. **Maps personality traits** to musical characteristics (energy, valence, danceability)
2. **Generates specific search queries** based on your psychological profile
3. **Provides reasoning** for each recommendation, creating a personal connection


## Development

To run locally create an .env file with Spotify and OpenAI API keys and then:
```bash
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
OPENAI_API_KEY=your_openai_api_key_here
```

```bash
npm install --legacy-peer-deps
npm run dev
```

The app will be available at `http://localhost:3000`.

## Contributing

This project is designed to be easily extendable:

Backend/Algorithm improvements:
- Add/improve existing questions (multiple users have commented that for some questions they don't feel like any answers fit them)
- Users can be prompted at question 12 to get more questions and then recieve 8 more questions (users can do this up until all questions in the question bank are given or we can set a hard limit).
- Integrate additional music services beyond Spotify
- Add a feature where users can recieve custom personalized questions (perhaps have some tool to generate questions during the onboarding pages)
- Improve recommendations

Frontend/Design improvements:
- Modify hover colors on the quiz questions to be more visible
- Modify landing card background gradient to be more fitting with the theme (also can expand on the landing page too)
- Multiple users have critiqued the slider so we should change the UI to be more clear about what it means 

Bugs to be fixed:
- On the final question instead of going directly to the results loading screen it displays another question for a brief second
- The spotify component is max volume we need to reduce it to 0.25x volume (This is actually much harder than it should be)
- On the edge of some gradient buttons the right or left few pixels do not match the gradient
  

## License

This project is licensed under the GNU Affero General Public License v3.0.

You are free to use, modify, and share this project non-commercially, provided that any derivative works or services using this project are also open-sourced under the same license.

See the full license text here: [AGPL-3.0 License](https://www.gnu.org/licenses/agpl-3.0.html)

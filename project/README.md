# Real Cluedo - Multiplayer Elimination Game

A cunning multiplayer elimination game where players must catch their targets holding specific objects in specific locations.

## 🎯 How to Play

1. **Join a Game**: Create or join a room with friends
2. **Get Your Assignment**: Each player gets a target, object, and location
3. **Hunt Your Target**: Catch them holding the object in the specified place
4. **Shout "Real Cluedo!"**: Claim your elimination
5. **Survive**: Someone is hunting you too - stay alert!

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A Supabase account (free tier works great!)

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd realcluedo
npm install
```

### 2. Set Up Supabase

#### Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Wait for the project to be ready (1-2 minutes)

#### Get Your Credentials
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL**
3. Copy your **anon/public key**

#### Set Environment Variables
Create a `.env` file in your project root:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

#### Set Up Database
1. In Supabase, go to **SQL Editor**
2. Copy and run the SQL from `supabase/migrations/001_initial_schema.sql`
3. This creates all necessary tables and security policies

### 3. Run the Game
```bash
npm run dev
```

The game will be available at `http://localhost:5173`

## 🎮 Features

- **Real-time Multiplayer**: Play with friends across different devices
- **Witness System**: Fair elimination verification
- **Progressive Web App**: Install on mobile devices
- **Customizable Games**: Adjust duration, rules, and settings
- **Live Chat**: Communicate with other players
- **Leaderboard**: Track your victories and stats

## 📱 Mobile Development (Optional)

### Build for Mobile
```bash
npm run cap:build
npm run cap:open android  # If you have Android Studio
```

### GitHub Codespaces
This project is configured for GitHub Codespaces with Android development support.

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Mobile**: Capacitor for native app deployment
- **Icons**: Lucide React
- **Build Tool**: Vite

## 🎮 Game Modes

- **Quick Games**: 1-3 days for fast-paced action
- **Standard Games**: 1 week for strategic gameplay  
- **Marathon Games**: Up to 2 weeks for ultimate cunning

## 🏆 Victory Conditions

- **Solo Victory**: Eliminate all other players (100 points)
- **Shared Victory**: Survive the full duration with others (points split)
- **Honor System**: Fair play and honest witnessing required

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run cap:build` - Build and sync with Capacitor
- `npm run cap:open android` - Open in Android Studio
- `npm run cap:run android` - Run on Android device/emulator

### Database Schema
The game uses the following main tables:
- `rooms` - Game rooms and settings
- `players` - Player data and assignments
- `elimination_claims` - Elimination claims and verification
- `chat_messages` - In-game chat
- `leaderboard` - Player statistics

### Real-time Features
- Live player updates
- Real-time chat
- Elimination notifications
- Game state synchronization

## 🎨 Design Philosophy

Real Cluedo emphasizes cunning over confrontation. The best players use social engineering, misdirection, and patience to achieve their eliminations while staying vigilant against their own hunters.

## ⚠️ Safety & Fair Play

- No dangerous throws or physical contact
- Respect personal boundaries and private spaces  
- Play honestly - only confirm eliminations you witnessed
- Keep it fun and lighthearted!

## 🚀 Deployment

### GitHub Pages
The project is configured for GitHub Pages deployment. Push to main branch to deploy.

### Netlify
Can also be deployed to Netlify for additional features like form handling.

## 🤝 Contributing

This is a fun project! Feel free to suggest improvements or report bugs.

## 📄 License

MIT License - feel free to use this for your own games!

---

**Ready to test your cunning? Set up Supabase and invite your friends!**
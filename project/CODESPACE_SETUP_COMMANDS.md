# 🚀 Codespace Setup Commands

## Step 1: Pull the Latest Files
First, make sure your Codespace has all the files you just uploaded:

```bash
git pull
```

## Step 2: Install Dependencies
Install all the required packages:

```bash
npm install
```

## Step 3: Set Up Environment Variables
Create your `.env` file with your Supabase credentials:

```bash
# Create the .env file
touch .env
```

Then edit the `.env` file (click on it in the file explorer) and add:
```
VITE_SUPABASE_URL=your_actual_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## Step 4: Start the Development Server
```bash
npm run dev
```

## Step 5: Open the Game
- Look for a popup that says "Open in Browser" or "Port 5173 is available"
- Click it to open the Bang Bang game
- Or manually go to the URL shown in the terminal (usually ends with `.preview.app.github.dev`)

## What You Should See
✅ The Bang Bang game main menu
✅ Options to create or join a game
✅ How to Play and Leaderboard buttons

## If You See Supabase Errors
That's normal! You'll need to:
1. Set up your Supabase project (if you haven't already)
2. Run the database migration SQL
3. Update your `.env` file with real credentials

The game will show a setup guide if Supabase isn't configured yet.
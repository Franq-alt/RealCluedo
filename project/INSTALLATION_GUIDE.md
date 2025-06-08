# 🔧 Installation Guide - Fix npm Error

## The Problem
You're getting `'npm' is not recognized as an internal or external command` because Node.js and npm are not installed on your computer.

## Solution: Install Node.js and npm

### Step 1: Download and Install Node.js
1. **Go to the official Node.js website:**
   - Visit: https://nodejs.org/
   - Download the **LTS version** (recommended for most users)
   - Choose the Windows installer (.msi file)

2. **Run the installer:**
   - Double-click the downloaded file
   - Follow the installation wizard
   - **Important:** Make sure "Add to PATH" is checked during installation
   - This will install both Node.js and npm

### Step 2: Verify Installation
1. **Close your current command prompt** (important!)
2. **Open a NEW command prompt:**
   - Press `Windows + R`
   - Type `cmd` and press Enter
3. **Test the installation:**
   ```bash
   node --version
   npm --version
   ```
   - You should see version numbers for both commands

### Step 3: Navigate to Your Project
1. **In the command prompt, navigate to your project folder:**
   ```bash
   cd "C:\Users\frank.roberson@ausgrid.com.au\OneDrive - Ausgrid\Downloads\bang-bang-game"
   ```

### Step 4: Install Project Dependencies
1. **Install the required packages:**
   ```bash
   npm install
   ```
   - This will download all the necessary files for the project

### Step 5: Start the Development Server
1. **Run the development server:**
   ```bash
   npm run dev
   ```
   - You should see something like "Local: http://localhost:5173"

## Alternative: Use Node Version Manager (Advanced)
If you prefer more control over Node.js versions:
1. Install **nvm-windows** from: https://github.com/coreybutler/nvm-windows
2. Use it to install and manage Node.js versions

## Troubleshooting

### If npm still isn't recognized after installation:
1. **Restart your computer** (this refreshes the PATH)
2. **Check your PATH environment variable:**
   - Search for "Environment Variables" in Windows
   - Look for Node.js in your PATH

### If you're on a corporate network:
- You might need IT assistance to install software
- Ask your IT department to install Node.js LTS version

## What Happens Next
Once npm is working:
1. The project dependencies will install
2. The development server will start
3. You can continue with the Supabase setup
4. The Bang Bang game will be ready to play!

## Quick Summary
```bash
# After installing Node.js, run these commands:
cd "C:\Users\frank.roberson@ausgrid.com.au\OneDrive - Ausgrid\Downloads\bang-bang-game"
npm install
npm run dev
```

Then continue with the Supabase setup from the previous guide.
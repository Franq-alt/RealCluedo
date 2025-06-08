# 🚀 Running Bang Bang Game Without Admin Rights

## The Problem
You can't install Node.js because you don't have administrator privileges on your work computer.

## Solution Options

### Option 1: Portable Node.js (Recommended)
You can run Node.js without installing it system-wide:

1. **Download Portable Node.js:**
   - Go to: https://nodejs.org/en/download/
   - Download the "Windows Binary (.zip)" version (not the installer)
   - Extract the ZIP file to a folder like `C:\Users\[your-username]\nodejs`

2. **Add to PATH temporarily:**
   - Open Command Prompt
   - Run this command (replace with your actual path):
   ```bash
   set PATH=%PATH%;C:\Users\frank.roberson@ausgrid.com.au\nodejs
   ```

3. **Test it works:**
   ```bash
   node --version
   npm --version
   ```

4. **Navigate to your project and run:**
   ```bash
   cd "C:\Users\frank.roberson@ausgrid.com.au\OneDrive - Ausgrid\Downloads\bang-bang-game"
   npm install
   npm run dev
   ```

### Option 2: Use GitHub Codespaces (Cloud-based)
Run the entire project in the cloud:

1. **Upload to GitHub:**
   - Create a GitHub account (free)
   - Upload your project files to a new repository

2. **Open in Codespaces:**
   - Click the green "Code" button on your repository
   - Select "Codespaces" → "Create codespace on main"
   - This gives you a full development environment in your browser

3. **Run the project:**
   ```bash
   npm install
   npm run dev
   ```

### Option 3: Use Online Development Environment
Try these browser-based solutions:

1. **StackBlitz:** https://stackblitz.com/
   - Upload your project files
   - Runs Node.js in the browser
   - No installation required

2. **CodeSandbox:** https://codesandbox.io/
   - Similar to StackBlitz
   - Good for React projects

### Option 4: Ask IT Department
Contact your IT support and ask them to:
- Install Node.js LTS version
- Or provide access to a development environment
- Many companies have policies for developer tools

### Option 5: Use Your Personal Device
If you have a personal laptop/computer:
- Install Node.js there
- Run the development server
- Access it from your work computer via network

## Recommended Approach: Portable Node.js

Here's the step-by-step for the portable approach:

### Step 1: Download Portable Node.js
1. Go to https://nodejs.org/en/download/
2. Click "Windows Binary (.zip)" under "Windows Installer"
3. Download the file (it's about 50MB)

### Step 2: Extract and Setup
1. Extract the ZIP to: `C:\Users\frank.roberson@ausgrid.com.au\nodejs`
2. Open Command Prompt
3. Run: `set PATH=%PATH%;C:\Users\frank.roberson@ausgrid.com.au\nodejs`

### Step 3: Test and Run
```bash
# Test Node.js works
node --version

# Navigate to your project
cd "C:\Users\frank.roberson@ausgrid.com.au\OneDrive - Ausgrid\Downloads\bang-bang-game"

# Install dependencies
npm install

# Start the development server
npm run dev
```

## After Getting Node.js Working

Once you have Node.js running (via any method above), you can:

1. **Start the development server**
2. **Continue with Supabase setup** using the guide I provided earlier
3. **Play the Bang Bang game!**

## Need Help?

If none of these options work:
- Try the GitHub Codespaces option (it's completely cloud-based)
- Contact your IT department about developer tool access
- Use a personal device if available

The portable Node.js option usually works well in corporate environments since it doesn't require system-level installation.
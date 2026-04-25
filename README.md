
🚀 Run and Deploy Your AI Studio App
This repository contains everything you need to run and deploy your AI Studio app locally.
🔗 View your app in AI Studio:
AI Studio App Link

📦 Prerequisites
- Node.js (latest LTS recommended)
- A valid Gemini API Key

🖥️ Run Locally
- Install dependencies
npm install
- Set environment variables
  - Create a file named .env.local in the project root and add your Gemini API key:
GEMINI_API_KEY=your_api_key_here
- Start the development server
npm run dev
- Open your browser and navigate to:
http://localhost:3000
🌐 Deployment
To deploy your app, you can use any Node.js‑compatible hosting service (e.g., Vercel, Netlify, or Render).
Example: Deploy on Vercel
- Install the Vercel CLI:
npm install -g vercel
- Run the deployment command:
vercel
- Set your environment variable in Vercel dashboard:
- GEMINI_API_KEY=your_api_key_here









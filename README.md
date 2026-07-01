<div align="center">

# 🎓 VIDYASETU

**AI-Driven School Management Platform**

Bridging students, teachers, parents, and administrators through one intelligent, unified system.

[Live Demo](https://vidyasetu-school-management.vercel.app) · [Report Bug](https://github.com/Rupam-Hait/VIDYASETU/issues) · [Request Feature](https://github.com/Rupam-Hait/VIDYASETU/issues)

</div>

---

## 📖 About

**VIDYASETU** (Sanskrit for *"bridge of knowledge"*) is a modern, AI-powered school management web app built with React, TypeScript, and the Google Gemini API. It brings admins, teachers, students, and parents onto a single dashboard — combining everyday school operations (notices, attendance, fees, live classes) with AI-driven learning tools like an intelligent chat tutor and auto-generated quizzes.

## ✨ Features

- 🔐 **Role-based dashboards** — tailored views and permissions for Admin, Teacher, Student, and Parent roles
- 📢 **Notices & announcements** — academic, event, and transport notices in one feed
- 📊 **Student performance tracking** — attendance percentage, average grades, and pending fees at a glance
- 🤖 **AI chat assistant (RAG-powered)** — a Gemini-backed chatbot that answers questions using the school's own knowledge base
- 📝 **AI-generated quizzes** — instantly create topic-based quizzes with multiple-choice questions for practice and assessment
- 🎥 **Live class scheduling** — create, schedule, and track class sessions (scheduled / live / ended) with attendee counts
- 📈 **Data visualizations** — charts and analytics powered by Recharts
- ⚡ **Fast, modern stack** — built with Vite for instant dev feedback and optimized production builds

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build Tool | [Vite](https://vitejs.dev) |
| AI | [Google Gemini API](https://ai.google.dev) (`@google/genai`) |
| Charts | [Recharts](https://recharts.org) |
| Icons | [Lucide React](https://lucide.dev) |

## 📂 Project Structure

```
VIDYASETU/
├── components/       # Reusable UI components
├── services/         # API / Gemini service integrations
├── App.tsx           # Root application component
├── constants.ts      # App-wide constants
├── types.ts          # Shared TypeScript types & interfaces
├── index.html         
├── index.tsx          
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (latest LTS recommended)
- A valid **Gemini API key** — get one from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rupam-Hait/VIDYASETU.git
   cd VIDYASETU
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173` (default Vite port).

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

## 🌐 Deployment

VIDYASETU can be deployed to any Node.js-compatible hosting platform, such as [Vercel](https://vercel.com), [Netlify](https://www.netlify.com), or [Render](https://render.com).

**Example: Deploy on Vercel**

```bash
npm install -g vercel
vercel
```

Then add your environment variable in the Vercel dashboard:
```
GEMINI_API_KEY=your_api_key_here
```

A live version is deployed at **[vidyasetu-school-management.vercel.app](https://vidyasetu-school-management.vercel.app)**.

## 🗺️ Roadmap

- [ ] Real-time notifications
- [ ] Fee payment gateway integration
- [ ] Mobile-responsive PWA support
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project currently has no license specified. Consider adding one (e.g. [MIT](https://choosealicense.com/licenses/mit/)) to clarify how others can use your code.

## 👤 Author

**Rupam Hait**
- GitHub: [@Rupam-Hait](https://github.com/Rupam-Hait)

---

<div align="center">

Forked from [AGNIV-CHOWDHURY/VIDYASETU-School-Management](https://github.com/AGNIV-CHOWDHURY/VIDYASETU-School-Management)

</div>








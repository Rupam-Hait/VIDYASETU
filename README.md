<div align="center">

```
██╗   ██╗██╗██████╗ ██╗   ██╗ █████╗ ███████╗███████╗████████╗██╗   ██╗
██║   ██║██║██╔══██╗╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝╚══██╔══╝██║   ██║
██║   ██║██║██║  ██║ ╚████╔╝ ███████║███████╗█████╗     ██║   ██║   ██║
╚██╗ ██╔╝██║██║  ██║  ╚██╔╝  ██╔══██║╚════██║██╔══╝     ██║   ██║   ██║
 ╚████╔╝ ██║██████╔╝   ██║   ██║  ██║███████║███████╗   ██║   ╚██████╔╝
  ╚═══╝  ╚═╝╚═════╝    ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝    ╚═════╝
```

### *"विद्या सेतु" — the bridge that carries knowledge across*

*A school management platform that thinks a little, so everyone else can focus on teaching and learning.*

**[→ Try the live demo](https://vidyasetu-mkwk.vercel.app/)** &nbsp;|&nbsp; **[Report a bug](https://github.com/Rupam-Hait/VIDYASETU/issues)** &nbsp;|&nbsp; **[Suggest a feature](https://github.com/Rupam-Hait/VIDYASETU/issues)**

</div>

<br>

## 🪔 The Idea

Every school runs on the same four pillars — **admins** juggling logistics, **teachers** juggling classrooms, **students** juggling deadlines, and **parents** juggling worry. Usually they're all stuck on different spreadsheets, WhatsApp groups, and notice boards, hoping the right information reaches the right person.

**VIDYASETU** puts all four on one bridge. One login, one dashboard tailored to who you are — and an AI tutor sitting quietly in the corner, ready to answer a student's question or spin up a quiz at 2am when no teacher is awake to do it.

<br>

## 🧭 What's Inside

<table>
<tr>
<td width="33%" valign="top">

### 🔐 One App, Four Worlds
Admins, teachers, students, and parents each get a dashboard built for *their* day — not a generic one they have to dig through.

</td>
<td width="33%" valign="top">

### 🤖 An AI That Actually Knows the School
A Gemini-powered chat assistant grounded in the school's own knowledge base (RAG) — so answers come from *your* documents, not the open internet.

</td>
<td width="33%" valign="top">

### 📝 Quizzes on Demand
Type a topic, get a quiz. Instantly generated multiple-choice questions for revision, practice, or a pop-quiz nobody saw coming.

</td>
</tr>
<tr>
<td width="33%" valign="top">

### 📢 One Feed, No Noise
Academic notices, events, and transport updates land in a single, sane feed instead of five different channels.

</td>
<td width="33%" valign="top">

### 📊 Progress, at a Glance
Attendance, average grades, and pending fees — the three numbers everyone actually wants to see — surfaced right up front.

</td>
<td width="33%" valign="top">

### 🎥 Live Classes, Tracked
Schedule a session, go live, and watch it move from *scheduled → live → ended* with attendance counted automatically.

</td>
</tr>
</table>

<br>

## 🏗️ Built With

Under the hood, VIDYASETU is a lean, modern front end with a real AI brain wired in:

```
⚛  React 19 + TypeScript   — the UI, strongly typed
⚡ Vite                    — instant dev server, fast builds
🧠 Google Gemini API       — the AI chat tutor & quiz generator
📈 Recharts                — the charts that make numbers readable
🎨 Lucide React             — the icons doing the small talk
```

<br>

## 🗂️ How It's Organized

```
VIDYASETU/
├── components/       → every reusable piece of UI lives here
├── services/         → the wiring to Gemini and other APIs
├── App.tsx           → where it all comes together
├── constants.ts      → the app's fixed vocabulary
├── types.ts          → the shape of everything (roles, notices, quizzes...)
├── index.html
├── index.tsx
└── vite.config.ts
```

<br>

## 🚦 Getting It Running

**You'll need:** [Node.js](https://nodejs.org) (LTS), and a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey) — it's free to generate.

```bash
# 1. Clone the bridge
git clone https://github.com/Rupam-Hait/VIDYASETU.git
cd VIDYASETU

# 2. Gather the materials
npm install

# 3. Hand it the key
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. Open it up
npm run dev
```

Now visit `http://localhost:5173` — the bridge is open.

**Shipping it for real?**

```bash
npm run build      # bundles everything for production
npm run preview    # walk across it once before launch
```

<br>

## ☁️ Taking It Live

VIDYASETU deploys cleanly to [Vercel](https://vercel.com), [Netlify](https://www.netlify.com), or any Node-friendly host:

```bash
npm install -g vercel
vercel
```

Just remember to set `GEMINI_API_KEY` in your host's environment variables — the AI tutor is quiet without it.

A working build is already live at **[vidyasetu-mkwk.vercel.app](https://vidyasetu-mkwk.vercel.app/)**.

<br>

## 🛤️ Where It's Headed

- [ ] Real-time notifications — so the feed pushes instead of waiting to be checked
- [ ] Fee payments, built in — no more redirecting to a third-party form
- [ ] A proper mobile experience (PWA)
- [ ] Multi-language support — knowledge shouldn't need translation

<br>

## 🤲 Contributing

Found a crack in the bridge? Help repair it:

1. Fork the repo
2. `git checkout -b feature/your-idea`
3. `git commit -m "Add: your idea"`
4. `git push origin feature/your-idea`
5. Open a Pull Request — and tell us what problem it solves

<br>

## 📜 License

No license is currently attached to this project — which technically means no one else can legally reuse it yet. Consider adding [MIT](https://choosealicense.com/licenses/mit/) if you'd like others to build on it.

<br>

## ✍️ Author

**Rupam Hait** — [@Rupam-Hait](https://github.com/Rupam-Hait)

<br>

<div align="center">

*Built on the foundation of* [AGNIV-CHOWDHURY/VIDYASETU-School-Management](https://github.com/AGNIV-CHOWDHURY/VIDYASETU-School-Management)

**A school is a hundred small bridges. This is one of them.**

</div>


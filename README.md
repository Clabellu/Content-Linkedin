# 📱 LinkedIn Content Automation App

Automated content curation for LinkedIn in the Marketing & AI sector.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn

### Setup

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Configure environment variables**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env and add your API keys
   ```

3. **Setup database**
   ```bash
   cd server
   npm run prisma:generate
   npm run prisma:migrate
   cd ..
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
linkedin-content-app/
├── client/          # React frontend (Vite + Tailwind)
├── server/          # Express backend (Node.js)
├── shared/          # Shared constants and types
└── .devcontainer/   # GitHub Codespaces config
```

## 🛠️ Development

### Available Scripts

```bash
npm run dev              # Start both client and server
npm run dev:client       # Start only frontend
npm run dev:server       # Start only backend
npm run install:all      # Install all dependencies
npm run clean            # Clean all node_modules
```

### Server Scripts

```bash
cd server
npm run dev              # Start with nodemon
npm run prisma:studio    # Open Prisma Studio
npm run prisma:migrate   # Run database migrations
```

## 📊 Current Progress

- ✅ Step 1: Project Setup Complete
- ⏳ Step 2: Database & Models (Next)
- ⏳ Step 3: RSS Fetcher
- ⏳ Step 4: Claude Integration
- ⏳ Step 5: OpenAI Images
- ⏳ Step 6-12: Frontend Features

## 🔑 Environment Variables

See `server/.env.example` for required environment variables.

**Required:**
- `ANTHROPIC_API_KEY` - Your Anthropic API key
- `OPENAI_API_KEY` - Your OpenAI API key

## 📝 Notes

- This is a personal tool for manual content curation
- Publishing to LinkedIn is done via copy/paste
- Analytics are handled manually

## 📖 Documentation

See `PROJECT_SPEC.md` for complete project specification.

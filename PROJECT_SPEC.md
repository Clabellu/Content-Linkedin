# 📱 LinkedIn Content Automation App - Project Specification

> **Versione**: 1.0  
> **Data**: Dicembre 2024  
> **Autore**: [Your Name]  
> **Scopo**: Documento di specifica per sviluppo con Claude Code

---

## 📋 Executive Summary

Applicazione React per automatizzare la creazione di contenuti per LinkedIn nel settore **Marketing e AI**. L'app estrapola articoli da fonti web, li riscrive usando Claude API, genera immagini con OpenAI (gpt-image-1), e li calendarizza per revisione manuale prima della pubblicazione.

### Obiettivi Chiave
- ✅ Automatizzare la content curation per LinkedIn
- ✅ Mantenere controllo umano prima della pubblicazione
- ✅ Evitare articoli duplicati
- ✅ Supportare 3+ post a settimana (configurabile)
- ✅ Preparare per eventuale SaaS futuro

---

## 🏗️ Architettura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React + Vite)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Dashboard  │  │  Calendar   │  │  Settings   │              │
│  │  - Bozze    │  │  - Preview  │  │  - Sources  │              │
│  │  - Review   │  │  - Schedule │  │  - Prompts  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js + Express)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Scheduler  │  │  API Routes │  │  Queue Mgmt │              │
│  │  (node-cron)│  │  /articles  │  │  (BullMQ)   │              │
│  │             │  │  /generate  │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  NEWS SOURCES │    │   AI LAYER    │    │   DATABASE    │
│               │    │               │    │               │
│ - Google News │    │ - Claude API  │    │ - SQLite/     │
│   RSS         │    │   (rewrite)   │    │   PostgreSQL  │
│ - RSS Feeds   │    │ - OpenAI      │    │               │
│ - Custom APIs │    │   gpt-image-1 │    │ - Articles    │
│               │    │   (images)    │    │ - Fingerprints│
└───────────────┘    └───────────────┘    │ - Schedule    │
                                          └───────────────┘
```

---

## 📁 Struttura del Progetto

```
linkedin-content-app/
│
├── 📁 client/                    # Frontend React
│   ├── 📁 public/
│   │   └── favicon.ico
│   │
│   ├── 📁 src/
│   │   ├── 📁 assets/            # Immagini, font, etc.
│   │   │
│   │   ├── 📁 components/        # Componenti riutilizzabili
│   │   │   ├── 📁 ui/            # Button, Card, Modal, Input
│   │   │   ├── 📁 layout/        # Header, Sidebar, Footer
│   │   │   └── 📁 common/        # Loading, Error, Empty states
│   │   │
│   │   ├── 📁 features/          # Feature-based modules
│   │   │   ├── 📁 articles/      # Gestione articoli
│   │   │   │   ├── ArticleCard.jsx
│   │   │   │   ├── ArticleList.jsx
│   │   │   │   ├── ArticlePreview.jsx
│   │   │   │   └── articleSlice.js
│   │   │   │
│   │   │   ├── 📁 calendar/      # Calendario e scheduling
│   │   │   │   ├── CalendarView.jsx
│   │   │   │   ├── DayCell.jsx
│   │   │   │   └── calendarSlice.js
│   │   │   │
│   │   │   ├── 📁 editor/        # Editor contenuti
│   │   │   │   ├── ContentEditor.jsx
│   │   │   │   ├── ImagePreview.jsx
│   │   │   │   └── LinkedInPreview.jsx
│   │   │   │
│   │   │   └── 📁 settings/      # Configurazioni
│   │   │       ├── SourcesConfig.jsx
│   │   │       ├── PromptsConfig.jsx
│   │   │       └── ScheduleConfig.jsx
│   │   │
│   │   ├── 📁 hooks/             # Custom React hooks
│   │   │   ├── useArticles.js
│   │   │   ├── useGeneration.js
│   │   │   └── useCalendar.js
│   │   │
│   │   ├── 📁 pages/             # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Calendar.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── ArticleDetail.jsx
│   │   │
│   │   ├── 📁 services/          # API calls
│   │   │   ├── api.js            # Axios instance
│   │   │   ├── articleService.js
│   │   │   └── generationService.js
│   │   │
│   │   ├── 📁 store/             # State management
│   │   │   ├── store.js
│   │   │   └── rootReducer.js
│   │   │
│   │   ├── 📁 styles/            # Global styles
│   │   │   ├── globals.css
│   │   │   └── variables.css
│   │   │
│   │   ├── 📁 utils/             # Utility functions
│   │   │   ├── dateUtils.js
│   │   │   ├── hashUtils.js
│   │   │   └── formatters.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── routes.jsx
│   │
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── 📁 server/                    # Backend Node.js
│   ├── 📁 src/
│   │   ├── 📁 config/            # Configurazioni
│   │   │   ├── database.js
│   │   │   ├── redis.js
│   │   │   └── env.js
│   │   │
│   │   ├── 📁 controllers/       # Route handlers
│   │   │   ├── articleController.js
│   │   │   ├── generationController.js
│   │   │   └── scheduleController.js
│   │   │
│   │   ├── 📁 services/          # Business logic
│   │   │   ├── 📁 sources/       # News sources
│   │   │   │   ├── googleNewsService.js
│   │   │   │   ├── rssService.js
│   │   │   │   └── sourceManager.js
│   │   │   │
│   │   │   ├── 📁 ai/            # AI integrations
│   │   │   │   ├── claudeService.js
│   │   │   │   ├── openaiImageService.js
│   │   │   │   └── promptTemplates.js
│   │   │   │
│   │   │   ├── articleService.js
│   │   │   ├── fingerprintService.js
│   │   │   └── schedulerService.js
│   │   │
│   │   ├── 📁 models/            # Database models
│   │   │   ├── Article.js
│   │   │   ├── GeneratedContent.js
│   │   │   ├── Schedule.js
│   │   │   └── Fingerprint.js
│   │   │
│   │   ├── 📁 routes/            # Express routes
│   │   │   ├── articles.js
│   │   │   ├── generation.js
│   │   │   ├── schedule.js
│   │   │   └── index.js
│   │   │
│   │   ├── 📁 middleware/        # Express middleware
│   │   │   ├── errorHandler.js
│   │   │   ├── validator.js
│   │   │   └── logger.js
│   │   │
│   │   ├── 📁 jobs/              # Scheduled jobs
│   │   │   ├── fetchArticlesJob.js
│   │   │   ├── generateContentJob.js
│   │   │   └── cleanupJob.js
│   │   │
│   │   ├── 📁 utils/             # Utilities
│   │   │   ├── hash.js
│   │   │   ├── logger.js
│   │   │   └── validators.js
│   │   │
│   │   └── app.js                # Express app setup
│   │
│   ├── 📁 prisma/                # Prisma ORM (se usato)
│   │   └── schema.prisma
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Entry point
│
├── 📁 shared/                    # Shared types/constants
│   ├── types.js
│   └── constants.js
│
├── 📁 docs/                      # Documentazione
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── .gitignore
├── docker-compose.yml            # Per development locale
├── package.json                  # Root package.json (workspaces)
├── README.md
└── PROJECT_SPEC.md               # Questo file
```

---

## 🔧 Stack Tecnologico

### Frontend
| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| React | 18.x | UI Framework |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Styling |
| React Router | 6.x | Routing |
| Redux Toolkit | 2.x | State management |
| React Query | 5.x | Server state |
| Axios | 1.x | HTTP client |
| date-fns | 3.x | Date utilities |
| Lucide React | Latest | Icons |

### Backend
| Tecnologia | Versione | Scopo |
|------------|----------|-------|
| Node.js | 20.x LTS | Runtime |
| Express | 4.x | Web framework |
| Prisma | 5.x | ORM |
| SQLite | 3.x | Database (dev) |
| PostgreSQL | 16.x | Database (prod) |
| BullMQ | 5.x | Job queue |
| node-cron | 3.x | Scheduler |
| Winston | 3.x | Logging |

### AI APIs
| Servizio | Modello | Scopo |
|----------|---------|-------|
| Anthropic | claude-sonnet-4-5-20250929 | Riscrittura contenuti |
| OpenAI | gpt-image-1 | Generazione immagini |

### News Sources (Free Tier)
| Fonte | Tipo | Note |
|-------|------|------|
| Google News RSS | RSS | Gratuito, illimitato |
| Feedly RSS | RSS | Gratuito fino a 100 feed |
| Feedparser (Node) | Library | Per parsing RSS |
| Custom RSS feeds | RSS | Blog specifici |

---

## 📊 Database Schema

```sql
-- Articoli originali fetchati
CREATE TABLE articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    url TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    published_at DATETIME,
    fetched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    fingerprint TEXT UNIQUE NOT NULL,  -- Hash per deduplicazione
    status TEXT DEFAULT 'new',         -- new, processed, rejected, archived
    category TEXT,                     -- marketing, ai, tech
    quality_score INTEGER DEFAULT 0,   -- Score 1-10, solo >= 6 vengono processati
    score_breakdown TEXT,              -- JSON con dettaglio score
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contenuti generati (riscritture + immagini)
CREATE TABLE generated_contents (
    id TEXT PRIMARY KEY,
    article_id TEXT REFERENCES articles(id),
    linkedin_text TEXT NOT NULL,
    image_url TEXT,                    -- URL immagine generata
    image_prompt TEXT,                 -- Prompt usato per immagine (generato da Claude)
    generation_model TEXT,             -- claude-sonnet-4-5 etc
    tone TEXT DEFAULT 'professional',  -- professional, casual, inspirational
    status TEXT DEFAULT 'draft',       -- draft, approved, scheduled, published
    edited_text TEXT,                  -- Testo dopo modifica manuale
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Calendario pubblicazioni
CREATE TABLE schedules (
    id TEXT PRIMARY KEY,
    content_id TEXT REFERENCES generated_contents(id),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME DEFAULT '09:00:00',
    day_of_week INTEGER,               -- 0=Sun, 1=Mon, etc
    status TEXT DEFAULT 'scheduled',   -- scheduled, published, cancelled
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Fingerprints per deduplicazione (storico)
CREATE TABLE fingerprints (
    id TEXT PRIMARY KEY,
    fingerprint TEXT UNIQUE NOT NULL,
    article_url TEXT,
    first_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    use_count INTEGER DEFAULT 1
);

-- Configurazione fonti
CREATE TABLE sources (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,                -- rss, google_news, api
    url TEXT NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 5,        -- 1-10, higher = more priority
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Articles
```
GET    /api/articles              # Lista articoli
GET    /api/articles/:id          # Dettaglio articolo
POST   /api/articles/fetch        # Trigger fetch manuale
PUT    /api/articles/:id/status   # Cambia status
DELETE /api/articles/:id          # Elimina articolo
```

### Generation
```
POST   /api/generate              # Genera contenuto da articolo
POST   /api/generate/batch        # Genera multipli
GET    /api/generate/:id          # Status generazione
PUT    /api/generate/:id          # Modifica contenuto generato
POST   /api/generate/:id/image    # Rigenera solo immagine
```

### Schedule
```
GET    /api/schedule              # Calendario completo
GET    /api/schedule/week         # Vista settimanale
POST   /api/schedule              # Schedula contenuto
PUT    /api/schedule/:id          # Modifica schedule
DELETE /api/schedule/:id          # Rimuovi da calendario
POST   /api/schedule/:id/approve  # Approva per pubblicazione
```

### Sources
```
GET    /api/sources               # Lista fonti
POST   /api/sources               # Aggiungi fonte
PUT    /api/sources/:id           # Modifica fonte
DELETE /api/sources/:id           # Rimuovi fonte
POST   /api/sources/:id/test      # Test connessione fonte
```

---

## 🔐 Variabili d'Ambiente

### Client (.env)
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=LinkedIn Content App
```

### Server (.env)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="file:./dev.db"
# DATABASE_URL="postgresql://user:pass@localhost:5432/linkedin_content"

# AI APIs
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Redis (per BullMQ, opzionale in dev)
REDIS_URL=redis://localhost:6379

# Scheduler
CRON_FETCH_SCHEDULE="0 6 * * *"    # Ogni giorno alle 6:00
CRON_TIMEZONE="Europe/Rome"

# Content Settings
DEFAULT_POSTS_PER_WEEK=3
MAX_ARTICLE_AGE_DAYS=7
FINGERPRINT_REUSE_DAYS=30
```

---

## 🤖 Prompt Templates

### LinkedIn Post Rewrite (Claude)

```javascript
const LINKEDIN_REWRITE_PROMPT = `
Sei un esperto di content marketing per LinkedIn nel settore AI e Marketing digitale.

ARTICOLO ORIGINALE:
Titolo: {{title}}
Contenuto: {{content}}
Fonte: {{source}}

ISTRUZIONI:
1. Riscrivi questo articolo come post LinkedIn professionale
2. Lunghezza: 150-300 parole (ideale per engagement)
3. Struttura:
   - Hook iniziale catchy (prima riga cruciale)
   - 2-3 punti chiave con bullet points o emoji
   - Call-to-action finale
4. Tono: Professionale ma accessibile
5. Includi 3-5 hashtag rilevanti alla fine
6. NON copiare testo letteralmente - RIFORMULA sempre
7. Genera anche un prompt per creare un'immagine correlata

OUTPUT in formato JSON:
{
  "linkedin_post": "Il testo del post...",
  "image_prompt": "Prompt di 2-3 frasi per generare un'immagine pertinente e unica per questo specifico contenuto. Descrivi lo stile visivo, i colori, gli elementi chiave da rappresentare."
}

Rispondi SOLO con il JSON, niente altro.
`;
```

### Image Generation (OpenAI gpt-image-1)

```javascript
// Il prompt per l'immagine viene generato dinamicamente da Claude
// basandosi sul contenuto specifico dell'articolo.
// Questo garantisce immagini uniche e pertinenti per ogni post.

const IMAGE_BASE_STYLE = `
Style requirements:
- Modern, clean design
- Corporate color palette (blues, whites, subtle gradients)
- Minimal text if any (max 3-5 words as overlay)
- 1200x628 pixels (LinkedIn optimal)
- Professional, tech-forward aesthetic

DO NOT include: faces, specific brand logos, text-heavy designs
`;

// Esempio di utilizzo:
// const fullPrompt = claudeGeneratedPrompt + IMAGE_BASE_STYLE;
```

---

## 🔄 Workflow Dettagliato

### 1. Fetch Articoli (Automatico - Daily)

```javascript
// jobs/fetchArticlesJob.js
async function fetchArticles() {
  const sources = await db.sources.findMany({ where: { is_active: true } });
  
  for (const source of sources) {
    const articles = await fetchFromSource(source);
    
    for (const article of articles) {
      // Genera fingerprint
      const fingerprint = generateFingerprint(article.title, article.url);
      
      // Check duplicato
      const exists = await db.fingerprints.findUnique({
        where: { fingerprint }
      });
      
      if (!exists) {
        await db.articles.create({ data: { ...article, fingerprint } });
        await db.fingerprints.create({ data: { fingerprint, article_url: article.url } });
      }
    }
  }
}
```

### 2. Generazione Contenuto (On-Demand o Scheduled)

```javascript
// services/ai/claudeService.js
const Anthropic = require('@anthropic-ai/sdk');

async function generateLinkedInPost(article) {
  const client = new Anthropic();
  
  const prompt = LINKEDIN_REWRITE_PROMPT
    .replace('{{title}}', article.title)
    .replace('{{content}}', article.content)
    .replace('{{source}}', article.source);
  
  const message = await client.messages.create({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }]
  });
  
  // Parse JSON response con post LinkedIn e prompt immagine
  const response = JSON.parse(message.content[0].text);
  
  return {
    linkedinPost: response.linkedin_post,
    imagePrompt: response.image_prompt  // Prompt dinamico per immagine unica
  };
}
```

### 3. Generazione Immagine (OpenAI)

```javascript
// services/ai/openaiImageService.js
const OpenAI = require('openai');

async function generatePostImage(dynamicPrompt) {
  const client = new OpenAI();
  
  // Combina il prompt dinamico (da Claude) con le linee guida di stile
  const fullPrompt = `${dynamicPrompt}

Style: Modern, clean, corporate design. Blues and whites. 
No faces, no brand logos, minimal text. Professional LinkedIn aesthetic.`;
  
  const response = await client.images.generate({
    model: "gpt-image-1",
    prompt: fullPrompt,
    n: 1,
    size: "1024x1024",
    quality: "medium"  // low: $0.01, medium: $0.04, high: $0.17
  });
  
  return response.data[0].url;
}
```

### 4. Sistema Anti-Duplicati

```javascript
// services/fingerprintService.js
const crypto = require('crypto');

function generateFingerprint(title, url) {
  // Normalizza il titolo
  const normalizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(' ')
    .filter(w => w.length > 3)
    .sort()
    .join(' ');
  
  // Estrai dominio
  const domain = new URL(url).hostname;
  
  // Combina e hash
  const combined = `${normalizedTitle}|${domain}`;
  return crypto.createHash('sha256').update(combined).digest('hex').slice(0, 16);
}

async function canUseArticle(fingerprint) {
  const existing = await db.fingerprints.findUnique({
    where: { fingerprint }
  });
  
  if (!existing) return true;
  
  // Può essere riusato dopo 30 giorni
  const daysSinceUse = (Date.now() - existing.last_seen_at) / (1000 * 60 * 60 * 24);
  return daysSinceUse > 30;
}
```

### 5. Content Quality Score

```javascript
// services/qualityScoreService.js

const KEYWORDS = {
  ai: ['artificial intelligence', 'machine learning', 'AI', 'neural', 'GPT', 'LLM', 'deep learning', 'automation', 'chatbot', 'Claude', 'OpenAI'],
  marketing: ['marketing', 'brand', 'content', 'social media', 'engagement', 'ROI', 'conversion', 'strategy', 'campaign', 'audience', 'growth']
};

function calculateQualityScore(article) {
  let score = 0;
  const breakdown = {};
  
  // 1. Lunghezza contenuto (max 3 punti)
  const contentLength = (article.content || article.description || '').length;
  if (contentLength >= 500) {
    breakdown.length = 3;
  } else if (contentLength >= 200) {
    breakdown.length = 2;
  } else if (contentLength >= 100) {
    breakdown.length = 1;
  } else {
    breakdown.length = 0;
  }
  score += breakdown.length;
  
  // 2. Freschezza - data pubblicazione (max 3 punti)
  const publishedAt = new Date(article.published_at);
  const daysSincePublish = (Date.now() - publishedAt) / (1000 * 60 * 60 * 24);
  if (daysSincePublish <= 1) {
    breakdown.freshness = 3;  // Ultimo giorno
  } else if (daysSincePublish <= 3) {
    breakdown.freshness = 2;  // Ultimi 3 giorni
  } else if (daysSincePublish <= 7) {
    breakdown.freshness = 1;  // Ultima settimana
  } else {
    breakdown.freshness = 0;  // Troppo vecchio
  }
  score += breakdown.freshness;
  
  // 3. Rilevanza keywords (max 4 punti)
  const text = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
  let keywordMatches = 0;
  
  [...KEYWORDS.ai, ...KEYWORDS.marketing].forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      keywordMatches++;
    }
  });
  
  if (keywordMatches >= 5) {
    breakdown.relevance = 4;
  } else if (keywordMatches >= 3) {
    breakdown.relevance = 3;
  } else if (keywordMatches >= 2) {
    breakdown.relevance = 2;
  } else if (keywordMatches >= 1) {
    breakdown.relevance = 1;
  } else {
    breakdown.relevance = 0;
  }
  score += breakdown.relevance;
  
  return {
    score,           // Totale 0-10
    breakdown,       // Dettaglio per categoria
    isProcessable: score >= 6  // Solo score >= 6 vengono processati
  };
}

// Esempio utilizzo nel fetch
async function fetchAndScoreArticles() {
  const articles = await fetchFromAllSources();
  
  return articles
    .map(article => {
      const quality = calculateQualityScore(article);
      return { ...article, ...quality };
    })
    .filter(article => article.isProcessable)  // Solo qualità >= 6
    .sort((a, b) => b.score - a.score);        // Ordina per qualità
}
```

---

## 🌐 RSS Feeds Consigliati (Marketing + AI)

```javascript
const DEFAULT_SOURCES = [
  // AI News
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    category: "ai"
  },
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss/",
    category: "ai"
  },
  {
    name: "Anthropic News",
    url: "https://www.anthropic.com/news/rss",
    category: "ai"
  },
  {
    name: "MIT News - AI",
    url: "https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml",
    category: "ai"
  },
  {
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    category: "ai"
  },
  
  // Marketing
  {
    name: "HubSpot Marketing Blog",
    url: "https://blog.hubspot.com/marketing/rss.xml",
    category: "marketing"
  },
  {
    name: "Marketing AI Institute",
    url: "http://www.marketingaiinstitute.com/blog/rss.xml",
    category: "marketing"
  },
  {
    name: "Content Marketing Institute",
    url: "https://contentmarketinginstitute.com/feed/",
    category: "marketing"
  },
  
  // Google News Searches (Dynamic)
  {
    name: "Google News - AI Marketing",
    url: "https://news.google.com/rss/search?q=AI+marketing&hl=it&gl=IT&ceid=IT:it",
    category: "marketing",
    type: "google_news"
  },
  {
    name: "Google News - Artificial Intelligence",
    url: "https://news.google.com/rss/search?q=artificial+intelligence+business&hl=it&gl=IT&ceid=IT:it",
    category: "ai",
    type: "google_news"
  }
];
```

---

## 💰 Stima Costi API

### Claude API (Anthropic)
- **Modello**: claude-sonnet-4-5-20250929
- **Prezzo**: ~$3/1M input tokens, ~$15/1M output tokens
- **Per post** (~500 token input, ~300 output): ~$0.006
- **3 post/settimana**: ~$0.08/mese

### OpenAI Image API (gpt-image-1)
- **Quality Medium**: ~$0.04/immagine
- **3 immagini/settimana**: ~$0.48/mese

### **Totale stimato: ~$0.60/mese per 3 post/settimana**

---

## 🚀 Setup Iniziale (Claude Code)

### Step 1: Inizializza il progetto
```bash
mkdir linkedin-content-app
cd linkedin-content-app
npm init -y

# Setup monorepo workspaces
npm pkg set workspaces='["client", "server", "shared"]'
```

### Step 2: Setup Client
```bash
npm create vite@latest client -- --template react
cd client
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Dependencies
npm install react-router-dom @reduxjs/toolkit react-redux @tanstack/react-query axios date-fns lucide-react
```

### Step 3: Setup Server
```bash
mkdir server && cd server
npm init -y
npm install express cors dotenv prisma @prisma/client
npm install @anthropic-ai/sdk openai
npm install node-cron bullmq rss-parser winston
npm install -D nodemon typescript @types/node @types/express

npx prisma init --datasource-provider sqlite
```

### Step 4: Configura Git
```bash
cd ..
git init
echo "node_modules\n.env\n*.db\n.DS_Store" > .gitignore
git add .
git commit -m "Initial project setup"
```

---

## ✅ Checklist Sviluppo

### Fase 1: MVP Backend
- [ ] Setup Express server
- [ ] Configurazione Prisma + SQLite
- [ ] Implementa RSS fetcher (Google News + custom feeds)
- [ ] Implementa sistema fingerprint
- [ ] Implementa Content Quality Score (filtro articoli)
- [ ] Integra Claude API per riscrittura + generazione prompt immagine
- [ ] Integra OpenAI per immagini (con prompt dinamico)
- [ ] API CRUD articoli
- [ ] Job scheduler con node-cron

### Fase 2: MVP Frontend
- [ ] Setup React + Vite + Tailwind
- [ ] Dashboard principale
- [ ] Lista articoli con filtri
- [ ] Editor contenuto con preview
- [ ] Vista calendario
- [ ] Pagina settings (fonti RSS)

### Fase 3: Polish
- [ ] Preview "LinkedIn style"
- [ ] Bulk operations
- [ ] Export contenuti
- [ ] Statistics/analytics
- [ ] Dark mode

### Fase 4: Future (SaaS Ready)
- [ ] Autenticazione (NextAuth/Clerk)
- [ ] Multi-tenant
- [ ] Migrazione PostgreSQL
- [ ] Deploy (Vercel + Railway)

---

## 📝 Note per Claude Code

1. **Ordine di sviluppo**: Inizia dal backend, poi frontend
2. **Testing**: Testa ogni servizio isolatamente prima di integrare
3. **Error handling**: Implementa gestione errori robusta per API calls
4. **Rate limiting**: Rispetta i rate limits delle API (Claude: 60 req/min, OpenAI: varia)
5. **Logging**: Usa Winston per logging strutturato
6. **Commits**: Commit frequenti e descrittivi

---

## 🔗 Risorse Utili

- [Anthropic API Docs](https://docs.anthropic.com/)
- [OpenAI Image API](https://platform.openai.com/docs/guides/images)
- [Vite Documentation](https://vite.dev/guide/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Google News RSS Guide](https://github.com/kotartemiy/pygooglenews)
- [RSS Parser (Node)](https://www.npmjs.com/package/rss-parser)

---

**Pronto per iniziare lo sviluppo con Claude Code! 🚀**

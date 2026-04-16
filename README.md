# MangaHive — Read & Watch Platform

A hybrid manga/webtoon + video drama platform combining static comics with short-form video content.

## 🚀 Live URLs

- **App**: https://mangahive.netlify.app
- **Admin**: https://mangahive.netlify.app/admin.html
- **Auth**: https://mangahive.netlify.app/auth.html
- **Manga Suite**: https://mangahive.netlify.app/mangahive-suite.html
- **Video Suite**: https://mangahive.netlify.app/video-suite.html

## 📁 File Structure

```
mangahive/
├── index.html              # Main app (Read manga + Watch video)
├── admin.html              # Admin panel (manage both content types)
├── auth.html               # Authentication
├── mangahive-suite.html    # AI manga production suite
├── video-suite.html        # Video storyboard suite
├── database-migration.sql  # SQL to add video support
└── api/                    # Vercel serverless functions
    ├── claude.js           # Anthropic Claude API proxy
    ├── huggingface.js      # HuggingFace inference proxy
    ├── replicate.js        # Replicate API proxy
    └── upload.js           # Supabase storage upload proxy
```

## 🎯 Features

### Content Types
| Type | Description | Coin Cost |
|------|-------------|-----------|
| 📖 Manga | Vertical scroll comic panels | 5 coins |
| 🎬 Video | Short-form drama episodes | 8 coins |

### App Features
- **Read/Watch Toggle** — Switch between manga and video content
- **Video Player** — Built-in player with progress bar, play/pause, seek
- **Coin System** — Unlock premium episodes with coins
- **Bookmarks** — Save both manga and video to library
- **Search** — Find content by title, genre, or type

### Admin Features
- **Story Type Selector** — Create manga OR video stories
- **Manga Chapter Upload** — Multiple page images
- **Video Episode Upload** — Video URL or file upload
- **Type Badges** — Visual indicators in manage table

## 🗄️ Database Schema

### Stories Table
```sql
id              UUID PRIMARY KEY
title           TEXT NOT NULL
genre           TEXT
author          TEXT
synopsis        TEXT
cover_url       TEXT
type            TEXT DEFAULT 'manga'     -- 'manga' or 'video'
preview_url     TEXT                      -- Video trailer URL
is_trending     BOOLEAN
views           INTEGER
rating          DECIMAL
chapters_count  INTEGER
status          TEXT
tags            TEXT[]
created_at      TIMESTAMP
```

### Chapters Table
```sql
id              UUID PRIMARY KEY
story_id        UUID REFERENCES stories(id)
episode_number  INTEGER
title           TEXT
is_free         BOOLEAN
coin_cost       INTEGER
type            TEXT DEFAULT 'manga'     -- 'manga' or 'video'
pages           TEXT[]                    -- For manga chapters
video_url       TEXT                      -- For video episodes
duration        INTEGER                   -- Video length in seconds
created_at      TIMESTAMP
```

## 🔧 Setup Instructions

### 1. Run Database Migration
Go to Supabase SQL Editor and run `database-migration.sql`

### 2. Deploy to GitHub
```bash
git add .
git commit -m "Add video drama support"
git push origin main
```

### 3. Netlify Auto-Deploys
Your site will auto-update at mangahive.netlify.app

## 💰 Monetization

| Content | Free Episodes | Premium Cost | Video Premium |
|---------|---------------|--------------|---------------|
| Manga   | First 3       | 5 coins      | —             |
| Video   | First 3       | —            | 8 coins       |

## 🎬 Video Production Pipeline

For creating AI-generated video dramas:

1. **Images**: Midjourney / DALL-E / Stable Diffusion
2. **Animation**: Hedra / Runway Gen-3 / Pika Labs
3. **Voice**: ElevenLabs (Hindi/English)
4. **Edit**: CapCut / DaVinci Resolve
5. **Format**: Vertical 9:16, 60-90 seconds per episode

### Cost Comparison
| Format | Production Cost | Time |
|--------|-----------------|------|
| Manga (current) | ₹200-500/ep | 2-3 hrs |
| AI Motion Drama | ₹500-1500/ep | 4-6 hrs |
| Real filmed drama | ₹50,000+/ep | Days |

## 🔐 Credentials

```
Supabase URL: https://uhjptxhhaipckshgytul.supabase.co
Admin Email: andiru6996@gmail.com
GitHub: andiru6996-pixel/Mangahive
```

## 📱 Technology Stack

- **Frontend**: Vanilla HTML/CSS/JS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: Netlify (static) + Vercel (API functions)
- **AI Tools**: Claude, HuggingFace, Replicate

---

Built with ❤️ for creators who want to tell stories in multiple formats.

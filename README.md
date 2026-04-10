# PBC Content Generator (web)

Next.js app for **Pivot Business Consulting**: landing page plus a wizard that matches the **PBC Content Generator Specification** (23-column Google Sheet).

## Features

- **Step 1:** Business name, industry, email, phone, website.
- **Step 2:** Topic, description, audience, goal, tone, platforms, keywords, competitors, and ICA fields (`avatar_who`, `avatar_pain`, `avatar_tried`).
- **Step 3:** One **pillar** title and **five cluster** titles (OpenAI if configured, otherwise a South Canterbury / Timaru template).
- **Submit:** Server-side **GET** with query parameters to your **Google Apps Script** web app (matches the PBC spec: POST bodies are often dropped when `fetch` follows Google’s redirect chain). Avatar fields are clipped to 150 characters for URL limits; long URLs get extra field shortening.
- **Download:** Markdown file of titles.

## Setup

1. Copy `.env.example` to `.env.local`.
2. Set `GOOGLE_SCRIPT_WEB_APP_URL` to your deployed script URL after you restore the working `Code.gs` from your specification and create a new deployment.
3. Optional: set `OPENAI_API_KEY` (and `OPENAI_MODEL`, default `gpt-4o-mini`) for AI-generated titles.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The wizard is at `/generator`.

## Deploy (public URL for mentees)

**GitHub + Vercel (recommended):** push this repo to GitHub, import it in [Vercel](https://vercel.com) with **Root Directory** set to **`pbc-web`**, add environment variables, share the production `*.vercel.app` URL.

**Alternative:** deploy from your PC only with `npx vercel` / `npx vercel --prod` inside `pbc-web/` (no GitHub).

Full steps: **[DEPLOY.md](./DEPLOY.md)**.

## Specification

Field keys and sheet columns follow your **PBC-Content-Generator-Specification** document (StoryBrand-oriented content rules apply when using OpenAI for titles; full article packs are out of scope for this MVP).

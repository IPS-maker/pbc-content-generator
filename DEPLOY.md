# Deploy PBC web (GitHub + Vercel)

**Stack:** Next.js on **Vercel** (stable trial URL, HTTPS, API routes on the server). **GitHub** holds the code; Vercel builds on every push.

**GitHub Pages alone cannot run this app** (it is static-only; we need `/api/*`).

---

## Path A — Recommended: GitHub repository + Vercel (auto-deploy)

### 1. Create the GitHub repository

1. On GitHub: **New repository** (any name, e.g. `import-into-wordpress` or `pbc-content-generator`).
2. Leave it empty or with a README only (no need to add a licence for a private trial).

### 2. Push this project from your computer

From the folder that contains `pbc-web/` (your **Import into WordPress** project root), in PowerShell or Git Bash:

```bash
git init
git add .
git commit -m "Add PBC content generator (pbc-web) and project files"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

If this folder is **already a git repo** with a remote, skip `git init` / `remote add` and use:

```bash
git add pbc-web .github
git status
git commit -m "PBC web: deploy docs and generator"
git push
```

Use a **`.gitignore`** that excludes secrets (this repo already ignores `.env` and `node_modules/`).

### 3. Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com) and sign in with **GitHub**.
2. **Add New Project** → **Import** your repository.
3. **Root Directory:** click **Edit** and set **`pbc-web`** (required when the Next app lives in a subfolder).
4. Framework: Next.js (auto-detected). Deploy once (build may succeed before env vars; Sheet submit will fail until step 4).

### 4. Environment variables (Vercel)

Project → **Settings** → **Environment Variables**. Add for **Production** (and **Preview** if mentees will use preview URLs):

| Name | Required for Sheet submit | Notes |
|------|---------------------------|--------|
| `GOOGLE_SCRIPT_WEB_APP_URL` | Yes | Apps Script web app `/exec` URL |
| `OPENAI_API_KEY` | No | Smarter titles; omit = template |
| `OPENAI_MODEL` | No | Default `gpt-4o-mini` |

Then **Deployments** → open the latest → **Redeploy** (or push a small commit) so the new variables apply.

### 5. Share the URL

Open the **Production** domain, e.g. `https://your-project.vercel.app`, and send it to mentees.

### 6. CI on GitHub (optional)

This repo includes `.github/workflows/pbc-web.yml`: on every push that touches `pbc-web/`, GitHub Actions runs `npm ci` and `npm run build` so broken builds are caught early.

---

## Path B — Vercel CLI only (no GitHub)

From `pbc-web/`:

```bash
npm install
npx vercel login
npx vercel
npx vercel --prod
```

Add the same environment variables in the Vercel dashboard. See steps 4–5 above.

---

## Trial checklist

- [ ] Code is on GitHub (Path A) or you use CLI (Path B).
- [ ] Vercel **Root Directory** = `pbc-web` when the repo is the monorepo.
- [ ] `GOOGLE_SCRIPT_WEB_APP_URL` set for **Production**.
- [ ] Apps Script returns plain text `OK` (per your PBC spec).
- [ ] Live site: run generator → submit → row appears in Sheet.

---

## Custom domain (later)

Vercel → **Settings** → **Domains** → add your domain and follow DNS steps.

# Quail's Travel Log

> *Guide to the Galaxy* — a personal travel tracking web app.

Track everywhere you've been: states, national parks, countries, breweries,
restaurants, hikes, and more. Plus a wishlist for everywhere you still want to go.

**Live site:** _(add your Netlify URL here once deployed)_

---

## What's in it

### ✅ Been There
| Section | What it tracks |
|---|---|
| 🇺🇸 **US** | Interactive state map, all 63 National Parks with photos, 50 state capitals, cities |
| 🌍 **World** | Interactive world map (countries + continents), 195-country checklist, 7 Wonders, Natural Wonders |
| 🍽️ **Eat & Drink** | Restaurants, bars, breweries, wineries, beers, wines, places stayed |
| 🌊 **Nature** | Beaches, lakes, rivers, islands, hikes, oceans & seas |
| 🏛️ **Culture** | Museums, historic sites, zoos & aquariums, city parks, road trips |
| 🎉 **Events** | Sporting events, amusement parks, festivals & fairs |

### 📌 Want to Go
A wishlist across 9 categories (eat, stay, bars, beaches, camping, outdoors,
kids, drives, other), with quick links out to Google Maps saved places.

### 📖 Travel Tips
"Quail's Guide to the Galaxy" — practical travel advice on choosing trips,
timing, airfare, budget, and packing.

---

## Accounts & saving

The app has a sign-in screen and saves each person's travels to their own account.
It runs in one of two modes:

### 📱 Local Mode (default — works immediately, no setup)
Accounts and travel data are stored in the browser's `localStorage`.
Good for trying it out and for personal use on one device.
**Data lives on that one device and browser only.**

### ☁️ Cloud Mode (real accounts that sync anywhere)
Turn this on to get proper accounts that work across phone, laptop, and tablet.

1. Create a free project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor** and run the contents of [`supabase-schema.sql`](./supabase-schema.sql)
3. Go to **Settings → API** and copy your **Project URL** and **anon public** key
4. Open `index.html` and paste them into the CONFIG block near the top:

```js
const SUPABASE_URL      = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbG...";
```

5. Commit and push — Netlify redeploys and cloud accounts are live

The anon key is safe to commit; it's designed to be public. Row Level Security
in the schema is what actually protects each person's data.

> While testing with family, you can skip email confirmation:
> **Authentication → Providers → Email → toggle off "Confirm email"**

### How saving works
Changes save automatically about a second after you stop making them.
A "Saving… / ✓ Saved" indicator appears in the header so you always know
where things stand.

## Tech

Single self-contained `index.html`. No build step required.

- **React 18** via CDN (UMD build)
- **Babel Standalone** for in-browser JSX
- **D3 v7** + **TopoJSON** for the choropleth maps
- **us-atlas** / **world-atlas** for map geometry
- **Wikipedia API** for national park photography
- **Supabase** for optional cloud accounts and sync

Everything loads from CDN, so the site works anywhere with no bundler,
no `npm install`, and no server.

---

## Deploying to Netlify

1. Log in to [netlify.com](https://netlify.com)
2. **Add new site → Import an existing project**
3. Connect to GitHub and pick this repository
4. Leave build settings empty — publish directory is `.`
5. Deploy

Netlify redeploys automatically on every push to `main`.

---

## Local preview

No build needed. Just open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## Roadmap

- [x] User accounts (local + Supabase auth)
- [x] Persist data between sessions
- [ ] Kids / family profiles
- [ ] Map pins on the Want to Go wishlist
- [ ] Friend sharing + public profile pages
- [ ] Custom domain

---

## Files

| File | Purpose |
|---|---|
| `index.html` | The complete app — this is what Netlify serves. Supabase keys go in the CONFIG block at the top |
| `supabase-schema.sql` | Database schema + row-level security. Run once in the Supabase SQL editor |
| `src-react-component.jsx` | The app as a React component, for a future Vite/Next build |
| `netlify.toml` | Netlify deploy config |

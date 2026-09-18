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

## Tech

Single self-contained `index.html`. No build step required.

- **React 18** via CDN (UMD build)
- **Babel Standalone** for in-browser JSX
- **D3 v7** + **TopoJSON** for the choropleth maps
- **us-atlas** / **world-atlas** for map geometry
- **Wikipedia API** for national park photography

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

- [ ] User accounts (Supabase auth)
- [ ] Persist data to a real database — currently resets on refresh
- [ ] Kids / family profiles
- [ ] Map pins on the Want to Go wishlist
- [ ] Friend sharing + public profile pages
- [ ] Custom domain

---

## Files

| File | Purpose |
|---|---|
| `index.html` | The complete app — this is what Netlify serves |
| `src-react-component.jsx` | The same app as a React component, for a future Vite/Next build |
| `netlify.toml` | Netlify deploy config |

DISCORD: ilyakudyavykh

X.com: https://x.com/IKucheriavykh

# AI Teacher (Chrome Extension)

Learn crypto and DeFi through an interactive, question-driven lesson flow. The AI teacher provides short explanations and always suggests 3–5 follow-up questions. You can also use a free chat and a DeFi strategies helper.

## Features
- Interactive lessons: compact answer + 3–5 follow-up questions (never ends)
- Free chat with the model
- DeFi strategies helper (summary + conservative/balanced/risky strategies)
- Local history stored in the browser
- Localization: EN, RU, UK, TR, ZH
- Clean UI: TailwindCSS + framer-motion animations

## Tech Stack
- React + Vite + TypeScript
- TailwindCSS, framer-motion
- i18next (localization)
- Fireworks AI (Dobby model)

## Quick Start
1) Install dependencies
```bash
cd app
npm install
```
2) Create `.env` in `app` directory
```bash
VITE_FIREWORKS_API_KEY=YOUR_FIREWORKS_KEY
```
3) Run dev server
```bash
npm run dev
```
Open `http://localhost:5173`.

## Build & Pack
- Build
```bash
npm run build
```
Artifacts: `app/dist`.

- Pack zip for Chrome
```bash
npm run pack:crx
```
Zip: `app/build/ai-defi-sentient.zip`.

- Load as Chrome extension
1. Open `chrome://extensions`
2. Enable Developer mode
3. Click “Load unpacked” and select `app/dist`

## Configuration
- Model and requests: `src/services/dobby.ts`
- Host permissions for Fireworks: `public/manifest.json`
- HashRouter is enabled for Chrome extension compatibility

## Project Structure
```
app/
  public/               # icons, manifest.json, assets
  src/
    components/         # UI components
    pages/              # Home, Lesson, ChatFree, History
    services/           # dobby, coingecko
    locales/            # translations
    i18n.ts             # i18next config
```

## Lesson (Teacher) — Response format
- Endpoint: `fetchDobbyTeacher(params, language)`
- Strict JSON:
```json
{
  "answer": "string",
  "follow_up_questions": [
    { "id": "string", "label": "string" }
  ]
}
```
- Used on the `Lesson` page

## Strategies — Response format
- Endpoint: `fetchDobbyStrategies(payload, language)`
- Strict JSON:
```json
{
  "summary": "string",
  "strategies": {
    "conservative": { "title": "", "description": "", "riskLevel": "", "expectedAPY": "", "links": [], "guide": "" },
    "balanced": { ... },
    "risky": { ... }
  }
}
```

## Notes
- This is not financial advice. Always verify links and understand the risks.

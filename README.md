# Binod World — Main Portal

The central gateway of Binod World (target address: binodworld.in). Static site for GitHub Pages: no server, no tracking, no external requests.

Binod World is a fictional Minecraft world and roleplay civilization. Its institutions, laws, offices and records are part of that fiction.

- Pages: `/` (Home), `/institutions/`, `/world/`, `/status/`
- Live in the browser: the Unified Binod Calendar (UBC) date, Active Temporal Flow state and Earth (India) time, from `js/calendar-engine.js`.
- Snapshot data: `js/data.js` (government register as of 22 November 2026). Update it, then rebuild.
- Rebuild the pages: `node .build/build.mjs <folder containing node_modules/playwright-core> <path to chrome>`.

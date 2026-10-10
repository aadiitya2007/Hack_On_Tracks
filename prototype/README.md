# VaultIQ - Prototype

This is the front-end-only, zero-dependency prototype of VaultIQ built for Hack On Track 2026.

## How to run
1. Simply double-click `index.html` to open it in your browser. 
2. No build step, no npm, no servers required. It works 100% offline.

## Deployment
Because this is a static site (HTML/CSS/JS), it can be deployed instantly to GitHub Pages, Netlify, Vercel, or Render by simply pointing the webroot to the `prototype/` folder.

## File Structure
- `index.html`: The main shell and layout structure.
- `styles.css`: The design system (CSS variables, layout, light/dark themes).
- `app.js`: Hash-routing logic, interaction handlers, and view rendering.
- `data.js`: The hardcoded mock database serving the entire app.

# ROHAN_OS: Retro Terminal UI/UX Portfolio

An extremely polished, premium, and highly interactive retro terminal workstation portfolio website designed specifically for **Rohan**, a UI/UX Designer based in Yamunanagar, India.

---

## ⚡ Key Highlights & Features

- **Double-Tiered Interface:**
  - **Simulated Directory sidebar tree & editor tabs** representing the visual graphic viewport.
  - **Full-featured interactive bottom terminal console** that supports various commands (`help`, `ls`, `cat`, `neofetch`, `theme`, `audio`, `scanlines`, `capabilities`, `clear`, `contact`).
- **Retro CRT Shader:** Smooth scanline filters, flickering keyframe patterns, and vignette curvature effects to wow recruiters. A top toggle bar allows visitors to switch the filter on/off or change volume states.
- **Audio Synthesis Engine:** Digital keyboard keystroke clicks synthetically created in real-time utilizing the lightweight **Web Audio API** (zero-dependency).
- **Three Nostalgic Themes:**
  1. **Paper Terminal (Default):** Crisp off-white workspace layout with deep warm-burnt accents.
  2. **Phosphor Green:** Radiant bright green phosphors on pitch carbon.
  3. **Amber Glow:** Smooth glowing retro-orange vectors.
- **Interactive Contact Wizard:** guiding users step-by-step through a secure collaboration encryption transaction right inside the terminal screen.

---

## ⚙️ How to Launch & Preview Locally

Because **ROHAN_OS** is built using high-performance, vanilla client-side web technologies, **no server setup, compilers, or build commands are required.** You can review it instantly!

### Option A: The Instant Double-Click (Easiest)
Simply locate the **[index.html](file:///C:/Users/anshu/.gemini/antigravity/scratch/rohan_portfolio/index.html)** file in your folder and **double-click to open it** in any web browser (Chrome, Edge, Firefox, etc.). Because we structured scripts without CORS-blocked ES6 modules, the portfolio works 100% offline straight out of the box!

### Option B: The Dev Server (Optional)
If you prefer running a local node server (e.g. for testing network speeds or responsive simulation tools), open your shell in this folder and run:
```bash
npm run dev
```
*(Requires Node.js to be installed on your system path).*

---

## 📂 Project Structure

- `index.html` — Core application layout structure & semantic viewer frames.
- `css/style.css` — Custom layout systems, scanline filters, and retro keyframe animation definitions.
- `js/data.js` — Structural database model mapping Case Studies, Resume entries, Philosophies, and SVG wireframes.
- `js/terminal.js` — Interactive CLI controller, command parses, and collaboration questionnaire script wizard.
- `js/app.js` — Orchestrator tying tabs, sidebars, sound click synth nodes, and page filters together.
- `package.json` — Declares easy-run local scripts.

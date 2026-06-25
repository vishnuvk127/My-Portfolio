# Vishnu Vardhan — Cinematic Portfolio

A premium, immersive portfolio hero section built for a data analytics engineer. Designed with a cinematic dark aesthetic, warm-orange practical lighting, and soft monitor-blue cloud-data glow — inspired by high-end technical portfolios and award-winning creative developer sites.

---

## Live Demo

> Deploy to Netlify or Vercel and paste your URL here.

---

## Preview

The hero section features:
- A fullscreen talking-head video with a blurred ambient duplicate as the atmospheric background
- A Three.js floating data-particle network overlay with mouse parallax
- GSAP-powered cinematic entrance animations
- Glassmorphism video controls and an auto-dismissing sound badge
- Animated scroll indicator

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 |
| 3D / Particles | Three.js r128 |
| Animation | GSAP 3 |
| Styling | CSS Modules |
| Deployment | Vercel / Netlify |

---

## Project Structure

```
├── app/
│   └── page.jsx                  # App Router entry point
├── components/
│   ├── VideoIntro.jsx            # Main hero section component
│   ├── VideoIntro.module.css     # Scoped styles
│   └── CinematicDataLayer.jsx    # Three.js particle engine
├── public/
│   └── videos/
│       └── hero.mp4              # Talking-head video asset
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Install required libraries
npm install three gsap
```

### Add your video

Place your talking-head video at:

```
public/videos/hero.mp4
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

### Option 1 — Netlify (HTML only, instant)

1. Build the project: `npm run build`
2. Drag the `out/` folder onto [netlify.com/drop](https://netlify.com/drop)
3. Your site is live immediately

Or for the self-contained `index.html` preview — drag a folder containing `index.html` and `hero.mp4` directly onto the Netlify drop page. No build step needed.

### Option 2 — Vercel (recommended for Next.js)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository directly at [vercel.com](https://vercel.com) — Vercel detects Next.js automatically and deploys on every push.

---

## Component Overview

### `VideoIntro.jsx`

The main hero section. Accepts two props:

| Prop | Type | Default | Description |
|---|---|---|---|
| `videoSrc` | string | `/videos/hero.mp4` | Path to the hero video |
| `nextId` | string | `next` | ID of the section to scroll to |

Features:
- Fullscreen sticky layout with ambient blurred background video
- Four cinematic gradient overlays plus warm-orange vignette and cool-blue glow
- GSAP entrance timeline: tagline → first name → last name → subtitle → controls → scroll indicator
- Play/pause and mute/unmute controls with glassmorphism styling
- Sound hint badge that auto-dismisses after 5 seconds
- Scroll indicator with animated pulse line

### `CinematicDataLayer.jsx`

Isolated Three.js canvas component. Renders transparently over the video.

- 160 warm-orange glowing particle nodes floating on sine-wave oscillation paths
- 90 network edges connecting nearby nodes, updated every frame to follow particles
- 18 bokeh depth spheres using additive blending (warm orange + monitor blue)
- Smooth mouse parallax camera movement
- Full WebGL resource disposal on component unmount

---

## Visual Design

The palette is built around three intentions:

- **Deep near-black `#060407`** — cinematic void, lets the video breathe
- **Warm orange `#FF8C42` → `#FFD166`** — practical lighting, representing quantitative and risk analytics
- **Monitor blue `rgba(40,120,220,0.09)`** — ambient cloud-data glow, referencing Snowflake and AWS Redshift

Typography uses Inter at 800 weight for the name block, with tight negative letter-spacing (`-0.035em`) for a compressed, editorial quality. The gradient on "VARDHAN" runs orange → gold → deep orange to give the surname a lit, premium feel without being decorative.

---

## Performance Notes

- `requestAnimationFrame` loop with sine-wave oscillation — no physics engine overhead
- Three.js pixel ratio capped at 1.8 to protect mobile GPUs
- Ambient video uses CSS `filter: blur()` — GPU-accelerated, no JS blur
- All Three.js geometries, materials, and the renderer are disposed on unmount
- GSAP context is reverted on unmount to prevent memory leaks
- Particle and edge buffer attributes are updated in-place (`needsUpdate = true`) — no geometry recreation per frame

---

## Customisation

**Change the name**

In `VideoIntro.jsx`, update the two `<span>` elements:

```jsx
<span ref={firstRef} className={styles.firstName}>YOUR FIRST NAME</span>
<span ref={lastRef}  className={styles.lastName}>YOUR LAST NAME</span>
```

**Change the tagline and subtitle**

Also in `VideoIntro.jsx`:

```jsx
<p ref={taglineRef} className={styles.tagline}>
  Your Specialty Here
</p>
<p ref={subRef} className={styles.subtitle}>
  Your one-line positioning statement.
</p>
```

**Adjust particle count or speed**

In `CinematicDataLayer.jsx`:

```js
const NODE_COUNT    = 160;   // number of floating nodes
const TARGET_EDGES  = 90;    // number of connecting edges
const MAX_EDGE_DIST = 70;    // max distance between connected nodes
```

---

## License

MIT — free to use, adapt, and deploy for personal and commercial portfolios.

---

## Author

**Vishnu Vardhan**  
Data Analytics Engineer — ETL automation, risk scoring models, scalable business intelligence  
[LinkedIn](https://linkedin.com/in/your-profile) · [Portfolio](https://your-domain.com)

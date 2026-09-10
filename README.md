# Prashik Koirala — Navy & Amber Portfolio

A complete personal portfolio in plain HTML, CSS, and JavaScript, styled after your supplied reference: navy surfaces, a warm amber accent, and a subtle schematic grid. The hero pairs your name and Frontend Developer role with a friendly introduction. Musicozy leads the work section with a full-width screenshot, followed by compact project rows.

## Open it locally

1. Extract the ZIP. On Windows, right-click it and choose **Extract All**.
2. Open the extracted `prashik-portfolio` folder.
3. Double-click **index.html**.

Keep the files and `assets` folder together. No installation, build command, Node.js, or API key is required. Fonts, screenshots, GSAP, ScrollTrigger, and Lenis are bundled locally. The portfolio renders offline; following GitHub, LinkedIn, or live-demo links requires internet access.

You can also open the folder in VS Code and use Live Server if you prefer automatic refresh while editing.

## What is included

- Your name, Frontend Developer role, personal introduction, location, and a compact information readout.
- A featured Musicozy project with a full-width screenshot, followed by compact iOS-inspired Calculator and Amazon UI Clone rows.
- One technical decision verified in the source code for each main project: IndexedDB cover storage, a two-pass expression evaluator, and reusable cards in a wrapping Flexbox layout.
- Three additional project cards: Wolf–Sheep Ecosystem, Encrypted Chat, and Distributed File Retrieval.
- Your biography and personal interests.
- Six skill groups covering HTML, CSS, JavaScript, Python, Java, C#, MySQL, Git/GitHub, computer science fundamentals, and debugging.
- An education and experience timeline.
- Email, LinkedIn, and GitHub links, with a working copy-email button.
- GSAP entrances, scroll reveals, skill-card staggering, subtle hover feedback, and Lenis wheel scrolling.
- A mobile navigation menu, keyboard focus states, a skip link, reduced-motion support, and print styles.

The outdated resume and its buttons are omitted, as requested. Nothing has been published or pushed to GitHub.

## Files to edit

| File | Purpose |
| --- | --- |
| `index.html` | All visible text, project descriptions, links, skills, and timeline entries |
| `style.css` | The complete navy/amber design, spacing, fonts, and responsive layouts |
| `script.js` | Navigation, animations, smooth scrolling, and email copying |
| `assets/projects/` | Actual screenshots from your repositories, optimized as WebP |
| `assets/fonts/` | Space Grotesk, Inter, and their font licenses |
| `assets/vendor/` | GSAP 3.13.0, ScrollTrigger 3.13.0, and Lenis 1.3.26 |
| `CREDITS.md` | Library and project sources |

## Design tokens

The `:root` block near the top of `style.css` controls the theme.

| Token | Color | Use |
| --- | --- | --- |
| `--bg` | `#0b1220` | Main background |
| `--surface` | `#121b2e` | Cards and panels |
| `--surface-2` | `#17233a` | Secondary surfaces |
| `--border` | `#22304a` | Dividers and outlines |
| `--text` | `#e8eaf0` | Primary text |
| `--text-muted` | `#98a2b8` | Secondary text, slightly brighter for readability |
| `--accent` | `#f5a623` | Buttons, links, and small highlights |

Headings use Space Grotesk; body text uses Inter. Both fonts are local.

## Editing guide

**Content:** edit `index.html` directly. The page does not depend on a fetched JSON file or JavaScript-generated content.

**Projects:** update the relevant article in the Work section. Project links point to their individual repositories. The three browser projects also have live-demo links. Replace screenshots in `assets/projects/` and keep each image's `alt`, `width`, and `height` attributes accurate.

**Email:** update the two `mailto:` links and the visible `.email-link` text. The copy button reads that visible email automatically. Email links open the visitor's email app; there is no form server or simulated message submission.

**Animations:** the hero timeline is in `setupMotion()` in `script.js`. Section content uses `data-reveal`. Primary buttons use `data-magnetic`. The CSS does not hide content before JavaScript runs, so a missing animation library does not leave the page blank.

**Smooth scrolling:** removing the Lenis script and stylesheet tags from `index.html` restores native scrolling. Touch scrolling remains native even with Lenis enabled.

**Experience:** the internship lists Merotech, using your more recent LinkedIn information, alongside the previously supplied dates, location, and responsibilities.

## Local review

Check desktop and phone widths, mobile navigation, keyboard navigation, project links, email copying, and your operating system's reduced-motion setting. HTML/CSS parsing, JavaScript syntax, local references, and archive contents were checked during preparation. Browser-based visual testing has not been performed.

The folder is ready for your own static hosting later, after you finish reviewing it.

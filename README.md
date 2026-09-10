# Prashik Koirala — Personal Portfolio

**[View live portfolio →](https://iamprashik.github.io/)**

My personal portfolio as a frontend developer based in Toronto, Ontario. It brings together my projects, skills, education, and experience in a responsive interface with a navy and amber theme.

Built with plain HTML, CSS, and JavaScript, with subtle animations and a focus on clear navigation.

## Tech stack

- **HTML5, CSS3, and vanilla JavaScript**
- **GSAP and ScrollTrigger** for entrance animations and scroll reveals
- **Lenis** for smooth scrolling
- **Canvas 2D** for the constellation background
- **GitHub Pages** for hosting

## Features

- Responsive layouts and mobile navigation.
- An amber constellation background in the hero, with gentle pointer interaction, a still frame for reduced motion, and automatic pauses when offscreen or in a hidden tab.
- Six projects, with Musicozy featured and live demos for the three web projects.
- A skills section and an education and experience timeline.
- Email and social links, plus a copy-email button.
- Keyboard navigation, visible focus states, a skip link, and reduced-motion support.
- Locally bundled fonts, screenshots, and animation libraries.

## Project structure

| File or folder | Purpose |
| --- | --- |
| `index.html` | Page content, sections, and project links |
| `style.css` | Theme, typography, responsive layouts, and hover effects |
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

## Credits

See [CREDITS.md](CREDITS.md) for library versions, font licenses, and project image sources.

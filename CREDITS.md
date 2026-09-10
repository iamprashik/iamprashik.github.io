# Credits and sources

## Animation and typography

| Asset | Version | Source and license |
| --- | --- | --- |
| GSAP | 3.13.0 | [Official documentation](https://gsap.com/docs/v3/) · [GSAP license](https://gsap.com/standard-license/) |
| ScrollTrigger | 3.13.0 | [Official plugin documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) · GSAP license |
| Lenis | 1.3.26 | [Official repository](https://github.com/darkroomengineering/lenis) · MIT, included in `assets/vendor/LENIS-LICENSE.txt` |
| Space Grotesk | Variable, Latin subset | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/spacegrotesk) · SIL Open Font License, included in `assets/fonts/OFL.txt` |
| Inter | Variable, Latin subset | [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/inter) · SIL Open Font License, included in `assets/fonts/INTER-OFL.txt` |

The vendor files are stored locally and retain their original distribution headers. GSAP and ScrollTrigger were obtained from the `gsap@3.13.0/dist/` distribution, and Lenis from `lenis@1.3.26/dist/` on jsDelivr. The font files were obtained through the Google Fonts CSS API. No CDN requests are necessary to render the portfolio.

The small arrow, copy, check, code, and social UI icons are inline SVG. The favicon is a text monogram. The schematic grid and soft animated glow are CSS.

## Project information and screenshots

Descriptions and links were checked against these project READMEs in September 2026:

- [Musicozy](https://github.com/iamprashik/Musicozy): screenshot from `screenshots/musicozy_desktop.png`.
- [iOS-inspired Calculator](https://github.com/iamprashik/ios-inspired-calculator): screenshot from `screenshots/calculator-desktop.png`.
- [Amazon UI Clone](https://github.com/iamprashik/amazon-ui-clone): screenshot from `screenshots/amazon-desktop-top.png`.
- [Wolf–Sheep Ecosystem Simulation](https://github.com/iamprashik/wolf_sheep_simulation).
- [E2EE Chat](https://github.com/iamprashik/e2ee-chat).
- [Distributed File Retrieval](https://github.com/iamprashik/distributed-file-retrieval).

The three screenshots are optimized WebP copies of the repository images. Their content has not been redesigned. Third-party branding, artwork, and music references visible in the screenshots retain their respective ownership; the original project repositories contain their attribution and educational-use context.

## Technical decisions

The three main project notes were checked against their implementation files on September 10, 2026:

- [Musicozy script.js](https://github.com/iamprashik/Musicozy/blob/HEAD/script.js): custom cover blobs use IndexedDB; likes and settings use localStorage.
- [Calculator script.js](https://github.com/iamprashik/ios-inspired-calculator/blob/HEAD/script.js): `evaluateWithPrecedence` resolves multiplication and division in a first pass, then addition and subtraction, without `eval()`.
- [Amazon clone style.css](https://github.com/iamprashik/amazon-ui-clone/blob/HEAD/style.css): shared `.box` and `.box-content` card styles inside a `.shop-section` Flexbox container with wrapping.

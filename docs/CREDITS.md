# Credits and licences: Bombay Craft

Everything third-party used on the site, with its source, author and licence.

## Logo

`src/assets/logo/bombay_crafts_logo.svg` is the agency's own mark (a PNG wrapped in SVG, 1.5MB).
The site ships `src/assets/logo/bombay-crafts-mark.webp` instead: the same artwork cropped to the
mark, with the background turned into transparency, 1100px wide, 33KB. It is used as a CSS mask
(`.logo-mask`), so it can be drawn in any colour (cream on the dark site).

## Imagery

None on the home page. The loom, the Pattern Lab cloth and the preloader sand are drawn live in canvas
(src/home/loom.js, weave.js, sand.js). The preloader lines are original copy written for the brand,
not quotations from films.

## Typefaces

| Family | Source | Author | Licence | File |
|---|---|---|---|---|
| General Sans (Variable) | [fontshare.com/fonts/general-sans](https://www.fontshare.com/fonts/general-sans) | Indian Type Foundry | ITF Free Font License v2.0 ([text](./licenses/ITF-FFL.txt)) | `public/fonts/GeneralSans-Variable.woff2` |
| Tiro Devanagari Marathi (Regular, Italic) | [@fontsource/tiro-devanagari-marathi](https://fontsource.org/fonts/tiro-devanagari-marathi) | Tiro Typeworks | SIL Open Font License 1.1 | bundled from `node_modules` |
| IBM Plex Mono (400, 500) | [@fontsource/ibm-plex-mono](https://fontsource.org/fonts/ibm-plex-mono) | IBM / Bold Monday | SIL Open Font License 1.1 | bundled from `node_modules` |

**FFL terms that apply to us:** commercial use and self-hosting are allowed. The file must stay
unmodified: no subsetting and no format conversion. It must not be redistributed through a public
repository, so this repo stays private.

## Code libraries

All installed from npm, each under its own licence: React and React DOM (MIT), GSAP with
`@gsap/react` (GSAP's standard "no charge" licence), Lenis (MIT), three.js (MIT, hero 3D, loaded in its own chunk), Tailwind
CSS (MIT) and Phosphor Icons (MIT).

## Files not in the repo

The repository is public, so two files are kept local and listed in `.gitignore`:

- `public/fonts/GeneralSans-Variable.woff2`: the ITF Free Font License forbids redistributing the
  font through a public repository. Download General Sans from
  [fontshare.com/fonts/general-sans](https://www.fontshare.com/fonts/general-sans) and copy the
  official `GeneralSans-Variable.woff2` into `public/fonts/`.
- `src/assets/home/marine-drive-sunset.mp4` (and its `-poster.webp`): rights for this clip are not
  confirmed. Add it locally, or replace it with footage the studio owns. The home page does not
  use it at the moment.

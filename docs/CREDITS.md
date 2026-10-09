# Credits and licences

Everything third-party used on the site, with its source, author and licence. The same list
appears on the site in the footer's **Credits** dialog (`src/lib/content.js` → `CREDITS`).

## 3D models

| Asset | Source | Author | Licence | Use on site | File |
|---|---|---|---|---|---|
| Vintage Video Camera (`vintage_video_camera`, 1k) | [polyhaven.com/a/vintage_video_camera](https://polyhaven.com/a/vintage_video_camera) | Jenelle van Heerden (photography, model), James Ray Cock (textures) | [CC0 1.0](https://polyhaven.com/license) | Video lens state in Services | `src/assets/models/vintage-camera.glb` |

**Processing:** `gltf-transform optimize --compress meshopt --texture-compress webp
--texture-size 1024` (gltf-transform CLI 4.5.1). This took it from 2.71MB to 432KB, with 17,871
triangles and three 1024² WebP textures. Required extensions: `EXT_meshopt_compression`,
`EXT_texture_webp` and `KHR_mesh_quantization`. CC0 needs no attribution; we credit it anyway.

No HDRIs or textures are downloaded. Lighting uses drei `<Lightformer>`s, and the frame tunnel,
dust, window and work-plane art are all procedural (shaders in `src/three/shaders/`).

## Typefaces

| Family | Source | Author | Licence | Files |
|---|---|---|---|---|
| Panchang (Variable) | [fontshare.com/fonts/panchang](https://www.fontshare.com/fonts/panchang) | Indian Type Foundry | ITF Free Font License v2.0 ([text](./licenses/ITF-FFL.txt)) | `public/fonts/Panchang-Variable.woff2` |
| Switzer (Variable) | [fontshare.com/fonts/switzer](https://www.fontshare.com/fonts/switzer) | Indian Type Foundry | ITF Free Font License v2.0 ([text](./licenses/ITF-FFL.txt)) | `public/fonts/Switzer-Variable.woff2` |
| Geist Mono (Variable) | [@fontsource-variable/geist-mono](https://fontsource.org/fonts/geist-mono) | Vercel | SIL Open Font License 1.1 | bundled from `node_modules` |

**FFL terms that apply to us:** commercial use and self-hosting are allowed. The files must stay
unmodified: no subsetting and no format conversion. The SHA-256 hashes of the shipped files
match the official kit. They must not be redistributed through a public repository, so this repo
is private (founder decision, 2026-10-10). Clients who need the fonts download their own copy
from Fontshare.

## Imagery

None yet. The four Selected Work pieces and the Open "Notes" tile use **PLACEHOLDER** art, the
site's own procedural frame motif labelled "Image to come". To swap in real images, add files
under `src/assets/work/`, import them in `src/lib/content.js` and set each project's `image`.
The WebGL planes pick them up automatically.

Four AI-generated candidate stills (headphones, handloom, e-bike, light trails) were made with
Canva's image generator and are in the studio's Canva uploads (media IDs `MAHXi5T-C4w`,
`MAHXi-OFm9U`, `MAHXi5KpnFI`, `MAHXiw9P6Iw`). They aren't on the site because only 200px
previews could be exported. If they're used, credit them here as AI-generated placeholder
imagery.

## Code libraries

All installed from npm, each under its own licence: React, React DOM, three.js, React Three
Fiber, drei and postprocessing (MIT), and GSAP with `@gsap/react` (GSAP's standard "no charge"
licence; every plugin has been free since 3.13). Also Lenis (MIT), Tailwind CSS (MIT) and
Phosphor Icons (MIT).

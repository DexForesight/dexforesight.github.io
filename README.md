# DexForesight

**Grounding Dexterous Policies with Implicit Spatial Foresight**

[Project page](https://dexforesight.github.io/) · [Paper](https://dexforesight.github.io/dexforesight.pdf)

Research project website from Sharpa Robotics, Shanghai Jiao Tong University, The Chinese University of Hong Kong, and Fudan University.

## Website

This is a static site. GitHub Pages serves the repository root from the `main` branch; no build step is required. `.nojekyll` preserves the static assets as supplied.

- `index.html`: research content, authors, affiliations, and task descriptions.
- `styles.css`: responsive layout, typography, and frosted-glass transitions.
- `app.js`: overview playback, title transition, task video controls, figure viewer, and citation copy.
- `media/overview.mp4`: opening overview.
- `media/background.mp4`: background loop, encoded at 3× the original demo speed.
- `media/tasks/`: Close Box, Insert Battery, and Screw On Lid experiments.
- `dexforesight.pdf`: paper.

The Insert Battery video starts at 00:14 of the original recording. The arXiv link is marked Coming soon until the preprint is available.

## Local preview

```sh
python3 -m http.server 8765
```

Open http://localhost:8765/.

## Assets

Research figures, videos, and the Sharpa logo were supplied for this project. Official university logo sources are recorded in `asset-sources.json`. Inter and Nunito font licenses are included in `fonts/`.

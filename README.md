# rodriguezv.com

A one-page personal site written as a man page. Plain HTML, CSS and two small
scripts. No build step, no dependencies.

| file | what it is |
|---|---|
| `index.html` | the page |
| `404.html` | "no manual entry for ..." |
| `style.css` | all the styling; colours, width and indent are variables at the top |
| `theme.js` | the light/dark switch |
| `prompt.js` | the shell under the page |
| `favicon.svg` | the 7 |
| `fonts/` | IBM Plex Mono, regular and semibold (SIL Open Font License 1.1) |
| `CNAME` | the custom domain, for GitHub Pages |
| `.github/workflows/deploy.yml` | stamps the version and publishes on every push to `main` |

## Run it locally

```sh
python3 -m http.server
# open http://localhost:8000
```

## Change things

- **Text**: edit `index.html` and type normally. The stylesheet shows section
  names in capitals and the rest in lowercase. The prompt's answers in
  `prompt.js` are written in lowercase, so what visitors type keeps its case.
- **Colours**: `light-dark(paper, terminal)` pairs at the top of `style.css`.
  The two `theme-color` metas in each page repeat the two backgrounds.
- **Commands**: add a function to `commands` in `prompt.js`. What `victor`
  prints is in `FLAGS` and `VICTOR_HELP`.
- **Visitors**: GoatCounter, one script tag in each page. The dashboard is
  public at vicrod.goatcounter.com; `stats` in the prompt opens it and `who`
  reads its counter. The host sits in `LINKS.stats` in `prompt.js` and in the
  two script tags. To leave your own visits out, run
  `localStorage.skipgc = 't'` once in the browser console.
- **Without the scripts**: drop either `<script>` tag. The page still follows
  the system theme and simply has no switch or no prompt.

## Publish

Push to `main`. The workflow stamps `VERSION` in `prompt.js` with
`yyyy.mm.nn`, where `nn` counts that month's commits, then uploads the files.
Nothing is committed back, so `victor --version` says `victor dev` locally
and the real number only on the live site.

One-time setup on GitHub:

1. Settings > Pages > Source: "GitHub Actions".
2. Custom domain: `rodriguezv.com`.
3. DNS at the registrar: four `A` records on `@` to `185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `CNAME` on
   `www` to `7ictor.github.io`.
4. Tick "Enforce HTTPS" once it becomes available, up to a day later.

Any static host serves the same files; only the version stamp needs the
workflow.

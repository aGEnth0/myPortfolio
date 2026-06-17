# CHUNG HANJUN — Photo Portfolio

A minimal personal photo portfolio. Static site, deployable to GitHub Pages.

## File structure

```
index.html                 ← the site (open this / GitHub serves this)
support.js                 ← runtime (required, do not edit)
image-slot.js              ← drag-and-drop slot component (edit mode only)
data/
  images.json              ← your photos (data URLs)  ← served on the web
  meta.json                ← EXIF metadata per photo
  structure.json           ← extra slots / custom series you added
assets/                    ← static assets
.nojekyll                  ← tells GitHub Pages to serve every file as-is
.image-slots.state.json    ← editing source (written while you edit)
rs-photo-meta.state.json   ← editing source
Portfolio.dc.html          ← editing source (edit here, then publish)
```

## Two modes

- **View mode (default, what visitors see):** photos only, no editing UI. Reads from `data/`.
- **Edit mode (you only):** press **Shift + E**. Drop / replace / remove photos, and use
  **+ Add photo** / **+ New series** once a section is full. Edit mode only activates in the
  authoring environment — on the published site Shift+E does nothing, so visitors can never edit.

## Publishing to GitHub Pages

1. Create a repo and push **all** files in this folder to it.
2. In the repo: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**,
   pick your branch (e.g. `main`) and the `/ (root)` folder. Save.
3. Your site goes live at `https://<username>.github.io/<repo>/` in a minute or two.

### Updating photos later

The site reads photos from the `data/` folder. After you change photos in the authoring
environment, refresh the `data/` snapshot before pushing:

- `data/images.json`  ← copy of `.image-slots.state.json`
- `data/meta.json`    ← copy of `rs-photo-meta.state.json`
- `data/structure.json` ← copy of `rs-structure.state.json` (if you added slots/series)

(If you'd rather, ask and I'll regenerate `index.html` + the `data/` snapshot for you, then you
just push.)

> The `.nojekyll` file is required — without it GitHub Pages would hide files in `data/` paths
> that begin with a dot and skip your assets. Keep it in the repo root.

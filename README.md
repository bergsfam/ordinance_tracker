# Stake Youth Ordinance Tracker (GitHub Pages)

This is a static website that runs on GitHub Pages using plain HTML, CSS, and JavaScript.

## File Structure

```
.
├── index.html
├── styles.css
├── script.js
├── data
│   ├── config.json
│   └── progress.json
└── assets
    ├── progress
    │   └── progress-picture.png
    └── temple
        ├── layer-0.png
        ├── layer-1.png
        ├── layer-2.png
        ├── layer-3.png
        ├── layer-4.png
        ├── layer-5.png
        └── layer-6.png
```

## Editor Instructions (Non-Technical)

1. Open `data/progress.json`.
2. Change only the number for `current_total`.
3. Save and commit/push your change.
4. GitHub Pages will update the site automatically.

Example:

```json
{
  "current_total": 1375
}
```

## Optional Goal Update

If needed, open `data/config.json` and change `goal_total`.
If this file is missing or invalid, the site defaults to a goal of `2500`.

## Progress Picture (50 Steps, 2% Each)

The progress picture now updates in 50 equal steps (every 2%).

1. Put your chosen image at `assets/progress/progress-picture.png`.
2. In `data/config.json`, set:

```json
{
  "goal_total": 2500,
  "progress_image": "assets/progress/progress-picture.png"
}
```

As progress increases, the image reveals from bottom to top in 2% increments.

## GitHub Pages Setup

1. Push this repository to GitHub.
2. In repository settings, open **Pages**.
3. Set source to **Deploy from a branch**.
4. Select your branch (usually `main`) and `/ (root)`.

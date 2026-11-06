# Assets

All imagery is committed to this repository under `public/images/` and served as root-relative paths (`/images/...`). Vite serves `public/` at the web root, so no imports or bundler config are involved — swapping an image is a file replacement.

Nothing is fetched from a third-party host at runtime.

```
public/images/
├── hero/
│   └── portrait.png        Hero portrait (Abhishek Babariya)
├── portfolio/
│   └── hero/
│       └── portrait.png    Home page portrait
└── cases/                    Case study visuals (placeholders — replace with real screenshots)
```

**Total: ~1 MB.**

---

## Replacing an image

1. Drop the new file into the matching folder under `public/images/`.
2. Update the path in the relevant source file (`HomePage.tsx` for the hero portrait, case study pages for evidence images).
3. Keep `loading="eager"` on hero images (LCP elements) and `loading="lazy"` elsewhere.

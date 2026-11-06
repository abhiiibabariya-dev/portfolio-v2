# Prompt 01 — Design specification

> This is the original design brief the project was built from. It remains the **source of truth for the visual design**: layout, spacing, animation behaviour, styling and responsiveness.
>
> It was written around a placeholder identity ("Jack", a 3D creator). That identity was replaced per [`02-content-brief.md`](02-content-brief.md) — but every design instruction below still governs the implementation. Where the two documents conflict, this one wins on *design* and the content brief wins on *content*.

---

Build a 3D Creator portfolio landing page for "Jack" using React, TypeScript, Tailwind CSS, Framer Motion, and Lucide React. The page has a dark theme (#0C0C0C background) with the font Kanit (Google Fonts, weights 300-900). The page title is "Jack -- 3D Creator".

## GLOBAL STYLES

- Background: #0C0C0C on html, body, #root, and the main wrapper
- Font family: 'Kanit', sans-serif
- Global reset: box-sizing border-box, margin 0, padding 0
- CSS class `.hero-heading`: gradient text using `background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%)` with `-webkit-background-clip: text` and `-webkit-text-fill-color: transparent`
- Main wrapper has `overflowX: 'clip'`

## SECTION ORDER

1. HeroSection
2. MarqueeSection
3. AboutSection
4. ServicesSection
5. ProjectsSection

## 1. HERO SECTION

Full viewport height (h-screen), flex column layout with overflowX: clip.

**Navbar:** Horizontal nav bar with 4 links -- "About", "Price", "Projects", "Contact" -- evenly spaced with justify-between. Text color #D7E2EA, font-medium, uppercase, tracking-wider. Sizes: text-sm md:text-lg lg:text-[1.4rem]. Padding: px-6 md:px-10 pt-6 md:pt-8. Hover: opacity 70% with 200ms transition.

**Hero Heading:** Massive h1 with text "Hi, i'm jack" (lowercase "i", curly apostrophe via `&apos;`). Uses the `.hero-heading` gradient text class. Font-black, uppercase, tracking-tight, leading-none, whitespace-nowrap, w-full. Font sizes: text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]. Margin top: mt-6 sm:mt-4 md:-mt-5. Wrapped in overflow-hidden container.

**Bottom bar:** Flexbox justify-between items-end with pb-7 sm:pb-8 md:pb-10:

- Left: paragraph text "a 3d creator driven by crafting striking and unforgettable projects", color #D7E2EA, font-light, uppercase, tracking-wide, leading-snug. Font size: clamp(0.75rem, 1.4vw, 1.5rem). Max-width: max-w-[160px] sm:max-w-[220px] md:max-w-[260px].
- Right: ContactButton component

**Hero Portrait:** Centered absolutely. Uses a Magnet component (mouse-following magnetic effect) wrapping an image. Magnet settings: padding 150, strength 3, activeTransition "transform 0.3s ease-out", inactiveTransition "transform 0.6s ease-in-out". Positioning: absolute left-1/2 -translate-x-1/2 z-10. Width: w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]. On mobile: top-1/2 -translate-y-1/2. On sm+: sm:top-auto sm:translate-y-0 sm:bottom-0.

**FadeIn animations:** Navbar fades in with delay 0, y -20. Heading: delay 0.15, y 40. Left text: delay 0.35, y 20. Contact button: delay 0.5, y 20. Portrait: delay 0.6, y 30.

## 2. MARQUEE SECTION

Two rows of images that scroll horizontally based on page scroll position. Background #0C0C0C. Padding: pt-24 sm:pt-32 md:pt-40 pb-10.

21 GIF images from motionsites.ai (see [`../ASSETS.md`](../ASSETS.md) for the full URL inventory).

- Row 1: first 11 images, tripled for seamless scrolling. Moves RIGHT on scroll (`translateX(offset - 200)`).
- Row 2: remaining 10 images, tripled. Moves LEFT on scroll (`translateX(-(offset - 200))`).
- Scroll offset calculated as: `(window.scrollY - sectionTop + window.innerHeight) * 0.3`
- Each image tile: 420px x 270px, rounded-2xl, object-cover, lazy loaded.
- Gap between tiles: gap-3. Gap between rows: gap-3.
- Uses `willChange: 'transform'` for performance. Scroll listener is passive.

## 3. ABOUT SECTION

Full-height centered section with min-h-screen, padding px-5 sm:px-8 md:px-10 py-20.

Four decorative 3D images positioned absolutely in corners:

- **Top-left:** Moon icon -- w-[120px] sm:w-[160px] md:w-[210px], positioned top-[4%] left-[1%] sm:left-[2%] md:left-[4%]. FadeIn: delay 0.1, x -80, y 0, duration 0.9.
- **Bottom-left:** 3D object -- w-[100px] sm:w-[140px] md:w-[180px], positioned bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]. FadeIn: delay 0.25, x -80, y 0, duration 0.9.
- **Top-right:** Lego icon -- w-[120px] sm:w-[160px] md:w-[210px], positioned top-[4%] right-[1%] sm:right-[2%] md:right-[4%]. FadeIn: delay 0.15, x 80, y 0, duration 0.9.
- **Bottom-right:** 3D group -- w-[130px] sm:w-[170px] md:w-[220px], positioned bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]. FadeIn: delay 0.3, x 80, y 0, duration 0.9.

**Heading:** "About me" using `.hero-heading` gradient text, font-black, uppercase, leading-none, tracking-tight, centered. Font size: clamp(3rem, 12vw, 160px). FadeIn: delay 0, y 40.

**Animated paragraph:** Uses a character-by-character scroll-driven opacity animation. Color #D7E2EA, font-medium, centered, leading-relaxed, max-w-[560px], font size clamp(1rem, 2vw, 1.35rem). Each character animates from opacity 0.2 to 1 based on scroll progress, with scroll offset `['start 0.8', 'end 0.2']`.

Contact button below the text block. Gap between heading/text: gap-10 sm:gap-14 md:gap-16. Gap between text block and button: gap-16 sm:gap-20 md:gap-24.

## 4. SERVICES SECTION

White background (#FFFFFF), with rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] top corners. Padding: px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32.

**Heading:** "Services" in #0C0C0C, font-black, uppercase, centered, font size clamp(3rem, 12vw, 160px). Margin bottom: mb-16 sm:mb-20 md:mb-28.

5 service items in a vertical list, max-w-5xl, centered.

Each item: horizontal layout with number (font-black, font size clamp(3rem, 10vw, 140px), color #0C0C0C) on the left and name + description stacked vertically on the right. Name: font-medium, uppercase, font size clamp(1rem, 2.2vw, 2.1rem). Description: font-light, leading-relaxed, max-w-2xl, font size clamp(0.85rem, 1.6vw, 1.25rem), opacity 0.6. Items separated by 1px borders (rgba(12, 12, 12, 0.15)). Padding: py-8 sm:py-10 md:py-12. Staggered FadeIn: each item delays by `i * 0.1`.

## 5. PROJECTS SECTION

Dark background (#0C0C0C), rounded top corners rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px], pulled up with -mt-10 sm:-mt-12 md:-mt-14, z-10.

**Heading:** Uses `.hero-heading` gradient, same styling as other headings.

3 sticky-stacking project cards that scale down as you scroll past them (card stacking effect using Framer Motion `useScroll` and `useTransform`). Each card is sticky top-24 md:top-32 inside an h-[85vh] container.

Scale calculation: `targetScale = 1 - (totalCards - 1 - index) * 0.03`. Each card offset by `top: ${index * 28}px`.

Each card has: rounded-[40px] sm:rounded-[50px] md:rounded-[60px], border-2 border-[#D7E2EA], background #0C0C0C, padding p-4 sm:p-6 md:p-8.

**Card layout:**

- Top row: Number (huge, same style as services), category label, project name, and a ghost button (rounded-full, border-2 #D7E2EA, uppercase, tracking-widest).
- Bottom row: Two-column image grid -- left column (40% width) has 2 stacked images, right column (60%) has 1 tall image. All images have heavy border radius rounded-[40px] sm:rounded-[50px] md:rounded-[60px]. Left top image height: clamp(130px, 16vw, 230px). Left bottom image height: clamp(160px, 22vw, 340px).

## REUSABLE COMPONENTS

**ContactButton:** Rounded-full pill button with gradient background `linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)`, inner box-shadow `0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset`, white 2px outline with -3px offset. Text: white, font-medium, uppercase, tracking-widest. Sizes: px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4, text text-xs sm:text-sm md:text-base. Label: "Contact Me".

**LiveProjectButton:** Ghost/outline pill button. Rounded-full, border-2 border-[#D7E2EA], text color #D7E2EA, font-medium, uppercase, tracking-widest. Sizes: px-8 py-3 sm:px-10 sm:py-3.5, text text-sm sm:text-base. Hover: bg-[#D7E2EA]/10.

**FadeIn:** Framer Motion wrapper using whileInView with `viewport={{ once: true, margin: "50px", amount: 0 }}`. Accepts delay, duration (default 0.7), x (default 0), y (default 30). Easing: `[0.25, 0.1, 0.25, 1]`. Uses `motion.create()` for dynamic element types.

**Magnet:** Mouse-following magnetic hover effect. Tracks mouse position relative to element center, applies translate3d transform divided by strength factor. Activates when cursor is within padding distance of element edge. Smooth transition in (0.3s ease-out) and out (0.6s ease-in-out). Uses `willChange: 'transform'`.

**AnimatedText:** Character-by-character scroll-reveal text animation. Each character goes from opacity 0.2 to 1 based on its position in the text relative to scroll progress. Uses Framer Motion `useScroll` targeting the paragraph element with offset `['start 0.8', 'end 0.2']`. Each character uses invisible placeholder + absolute positioned animated span.

## KEY DEPENDENCIES

- react, react-dom (^18.3.1)
- framer-motion (^12.38.0)
- lucide-react (^0.344.0)
- tailwindcss (^3.4.1)
- vite, typescript

## RESPONSIVE BREAKPOINTS

All sections use Tailwind's default breakpoints (sm: 640px, md: 768px, lg: 1024px) with mobile-first approach. Heavy use of `clamp()` for fluid typography. The entire design scales gracefully from mobile to ultra-wide screens.

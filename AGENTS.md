# Project Custom Instructions

## Interactivity & Physics
- We use `matter-js` for real-time physics simulations.
- Interactive components should favor physical feedback (dragging, bouncing, gravity) to maintain the "Playground" theme.
- All core sections are managed by an `IntersectionObserver` in `Background.tsx` for theme-based color shifting.
- When adding new sections, remember to include their IDs in the `Background.tsx` observer list and theme palette.

## Animations
- Use `gsap` for entrance animations and refined interactions (like magnetic buttons or 3D tilts).
- Use CSS Variables (`--mouse-x`, `--mouse-y`) in `Background.tsx` for low-cost global parallax effects.

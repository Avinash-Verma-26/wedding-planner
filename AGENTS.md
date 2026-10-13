# Repository instructions

Before adding a feature, changing the build, adding a dependency, or restructuring source code, read `ARCHITECTURE.md`. Keep its structure and assumptions current as part of the same change.

Keep `src/App.jsx` limited to application composition and top-level shared state. Place feature UI in `src/features`, reusable primitives in `src/components`, reusable state in `src/hooks`, and domain logic in `src/utils`.

# Frontend

Next.js 16 frontend for the Gift Recommendation Platform.

## Folder Structure

```text
frontend/
|-- .env.example
|-- eslint.config.mjs
|-- next-env.d.ts
|-- next.config.ts
|-- package.json
|-- postcss.config.mjs
|-- tsconfig.json
`-- src/
    |-- app/
    |   |-- error.tsx
    |   |-- favicon.ico
    |   |-- globals.css
    |   |-- layout.tsx
    |   |-- loading.tsx
    |   |-- not-found.tsx
    |   |-- page.tsx
    |   `-- gifts/
    |       |-- loading.tsx
    |       |-- page.tsx
    |       `-- [id]/
    |           |-- loading.tsx
    |           `-- page.tsx
    |-- components/
    |   |-- gifts/
    |   |   |-- filter-bar.tsx
    |   |   |-- gift-card.tsx
    |   |   |-- gift-grid.tsx
    |   |   `-- price-comparison.tsx
    |   |-- layout/
    |   |   |-- site-footer.tsx
    |   |   `-- site-header.tsx
    |   `-- ui/
    |       |-- empty-state.tsx
    |       |-- error-state.tsx
    |       |-- loading-cards.tsx
    |       `-- section-heading.tsx
    |-- lib/
    |   |-- constants.ts
    |   |-- formatters.ts
    |   |-- seo.ts
    |   `-- api/
    |       |-- categories.ts
    |       |-- client.ts
    |       |-- config.ts
    |       |-- prices.ts
    |       |-- products.ts
    |       `-- query.ts
    `-- types/
        |-- api.ts
        |-- category.ts
        |-- filters.ts
        |-- price.ts
        `-- product.ts
```

## Setup

1. Copy `.env.example` to `.env.local`
2. Install dependencies with `npm install`
3. Run the app with `npm run dev`
4. Open `http://localhost:3000` or your configured port

## Notes

- The app expects the NestJS backend to expose APIs under `NEXT_PUBLIC_API_BASE_URL`.
- All API data is typed through shared interfaces in `src/types`.
- Pages use server components by default, and `FilterBar` is the only required client component for interactive filtering.

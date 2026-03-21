# AG-Grid Demo - High Performance Angular Application

A complete Angular 21 demo application showcasing high-performance AG-Grid implementation for 100K+ records with Tailwind CSS styling.

## Features

- **100,000 Mock Records** - In-memory generated employee/sales data
- **Client-Side Row Model** - Fast filtering, sorting, and pagination
- **Virtual Scrolling** - Smooth scrolling with row virtualization
- **Multi-Column Sorting** - Hold Shift to sort by multiple columns
- **Global Search** - Debounced 300ms search across all text columns
- **Column Filtering** - Text, number, and date filters on all columns
- **Row Selection** - Checkbox multi-select
- **CSV & Excel Export** - Export selected or all rows
- **Detail Side Panel** - Click any row to view full employee details
- **Performance Dashboard** - Live metrics showing render time, filter count, etc.
- **Custom Cell Renderers** - Status badges, star ratings, action buttons
- **Dark Theme** - Custom AG-Grid alpine dark theme with Tailwind CSS
- **Responsive Layout** - Grid fills viewport height

## Tech Stack

- Angular 21 (standalone components)
- AG-Grid Community v35
- Tailwind CSS v4
- TypeScript strict mode
- SCSS for additional styling

## Setup

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200/`

## Project Structure

```
src/app/
├── core/
│   ├── services/
│   │   ├── data.service.ts        ← Mock data generation + filtering/sorting
│   │   └── export.service.ts      ← CSV/Excel export logic
│   └── models/
│       └── employee.model.ts      ← Employee interface & constants
├── features/
│   └── grid-demo/
│       ├── grid-demo.component.*  ← Main grid container
│       └── components/
│           ├── toolbar/           ← Search, filters, export buttons
│           ├── stats-bar/         ← Performance metrics display
│           ├── detail-panel/      ← Employee detail side panel
│           └── cell-renderers/    ← Custom AG-Grid cell renderers
│               ├── status-badge/
│               ├── star-rating/
│               └── action-buttons/
└── app.ts                         ← Root component
```

## Performance Optimizations

- OnPush change detection on all components
- Debounced search input (300ms)
- Row virtualization with buffer of 10
- Stable row identity via getRowId()
- animateRows disabled for performance
- Efficient in-memory filtering and sorting

## Scaling to Production

To connect to a real backend:
1. Replace `DataService` with HTTP calls to your NestJS/Express API
2. Implement server-side pagination, sorting, and filtering endpoints
3. Consider switching to AG-Grid Enterprise Server-Side Row Model
4. Add authentication and authorization
5. Implement caching strategies for frequently accessed data
# AG-Grid

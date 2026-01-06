# Portfolio Admin

Modern admin panel for managing portfolio content, built with Nuxt 3 and TypeScript.

## Tech Stack

- **Framework:** Nuxt 3 + TypeScript
- **UI:** Tailwind CSS + shadcn-vue
- **Forms:** VeeValidate + Zod
- **State Management:** Pinia + TanStack Query
- **Rich Text:** TipTap
- **Code Quality:** ESLint + Prettier + Husky
- **Testing:** Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm installed
- Portfolio API running (see environment variables)

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the values
3. Install dependencies:

```bash
pnpm install
```

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
portfolio-admin/
├── app/
│   ├── assets/           # Styles, fonts
│   ├── components/       # Vue components
│   ├── composables/      # Vue composables
│   ├── layouts/          # Nuxt layouts
│   ├── middleware/       # Route middleware
│   ├── pages/            # File-based routing
│   ├── plugins/          # Nuxt plugins
│   ├── stores/           # Pinia stores
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── server/               # Server-side code
├── public/               # Static assets
└── tests/                # Test files
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint code
- `pnpm lint:fix` - Lint and fix code
- `pnpm format` - Format code with Prettier

## Environment Variables

See `.env.example` for required environment variables.

## Development Workflow

This project follows a feature-branch workflow. See `plan.md` for the complete implementation roadmap.

## License

Private project

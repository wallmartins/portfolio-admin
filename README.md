# Portfolio Admin

A modern, full-featured admin panel for managing portfolio content built with Nuxt 3, TypeScript, and Tailwind CSS.

## Features

- 🔐 **GitHub OAuth Authentication** - Secure authentication via GitHub
- 📝 **Content Management** - Full CRUD for posts, projects, experiences, and more
- 🌍 **Multi-language Support** - pt-BR and en-US content management
- 🤖 **AI Integration** - Content generation, translation, and SEO assistance
- 📊 **Dashboard** - Overview of portfolio stats and recent activity
- 🎨 **Modern UI** - Built with shadcn-vue components and Tailwind CSS
- 📱 **Responsive Design** - Mobile-first approach
- ✅ **Comprehensive Testing** - Unit, component, and E2E tests
- 🚀 **Production Ready** - Optimized for Vercel deployment

## Tech Stack

### Core
- **Framework:** Nuxt 3
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn-vue (Reka UI)
- **Icons:** Lucide Vue Next

### State & Data
- **State Management:** Pinia
- **Data Fetching:** TanStack Query (Vue Query)
- **Form Management:** VeeValidate + Zod
- **Rich Text Editor:** TipTap

### Testing
- **Unit/Component:** Vitest + @vue/test-utils
- **E2E:** Playwright
- **Coverage:** Vitest Coverage (100% for unit/component tests)

### Development
- **Linting:** ESLint
- **Formatting:** Prettier
- **Git Hooks:** Husky + lint-staged
- **CI/CD:** GitHub Actions

## Prerequisites

- Node.js 20.x or higher
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/wallmartins/portfolio-admin.git
cd portfolio-admin
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Configure the following variables:

```env
# Portfolio API (main backend)
NUXT_PUBLIC_API_URL=http://localhost:9501

# AI API (separate backend service)
NUXT_PUBLIC_AI_API_URL=http://localhost:3001

# Optional: Sentry for error tracking
# SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### 4. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run generate     # Generate static site
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
```

### Testing
```bash
npm run test              # Run unit/component tests
npm run test:ui           # Run tests with UI
npm run test:coverage     # Generate coverage report
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Run E2E tests with UI
npm run test:e2e:report   # View E2E test report
```

## Project Structure

```
portfolio-admin/
├── .github/              # GitHub Actions workflows
├── app/                  # Application source code
│   ├── assets/          # Static assets (CSS, images)
│   ├── components/      # Vue components
│   │   ├── ui/          # shadcn-vue components
│   │   ├── features/    # Feature-specific components
│   │   └── layouts/     # Layout components
│   ├── composables/     # Vue composables
│   ├── layouts/         # Nuxt layouts
│   ├── middleware/      # Route middleware
│   ├── pages/           # File-based routing
│   ├── plugins/         # Nuxt plugins
│   ├── stores/          # Pinia stores
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── public/              # Static public files
├── tests/               # Test files
│   ├── e2e/            # E2E tests
│   ├── unit/           # Unit tests
│   └── setup.ts        # Test setup
├── nuxt.config.ts       # Nuxt configuration
├── tailwind.config.ts   # Tailwind configuration
└── package.json         # Dependencies
```

## Authentication

This application uses GitHub OAuth for authentication:

1. User clicks "Login with GitHub"
2. Redirected to backend API `/auth/github/redirect`
3. GitHub OAuth authorization
4. Callback to backend `/auth/github/callback`
5. Backend returns JWT + user data
6. Frontend stores JWT in localStorage

**No GitHub credentials needed in frontend** - all OAuth logic is handled by the backend API.

## API Integration

The application consumes two backend APIs:

### Portfolio API (Main Backend)
- Base URL: `NUXT_PUBLIC_API_URL`
- Endpoints:
  - `GET/POST/PUT/DELETE /admin/posts` - Blog posts
  - `GET/POST/PUT/DELETE /admin/projects` - Projects
  - `GET/POST/PUT/DELETE /admin/techs` - Technologies
  - `GET/POST/PUT/DELETE /admin/social` - Social links
  - `GET/POST/PUT/DELETE /admin/experiences` - Work experience
  - `GET/POST/PUT/DELETE /admin/about` - About information

### AI API (Separate Service)
- Base URL: `NUXT_PUBLIC_AI_API_URL`
- Features:
  - Content generation for posts/projects
  - Auto-translation (pt-BR ↔ en-US)
  - SEO meta description generation

## Testing

### Running Tests

```bash
# All unit/component tests
npm run test

# With coverage
npm run test:coverage

# E2E tests (requires running dev server)
npm run dev  # In one terminal
npm run test:e2e  # In another terminal
```

### Test Coverage

Current coverage: **100% for unit/component tests**

- ✅ useAuth composable: 14/14 tests
- ✅ Components: 9/9 tests
- ✅ useApi composable: 2/2 tests

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

4. Set environment variables in Vercel dashboard:
   - `NUXT_PUBLIC_API_URL`
   - `NUXT_PUBLIC_AI_API_URL`
   - `SENTRY_DSN` (optional)

### Environment Variables in Production

Make sure to configure:
- Portfolio API URL (production backend)
- AI API URL (production AI service)
- GitHub OAuth callback URLs must match production URL

## Performance Optimizations

- ✅ **Code Splitting** - Automatic route-based splitting
- ✅ **Image Optimization** - WebP/AVIF formats with responsive sizes
- ✅ **Lazy Loading** - Heavy components loaded on demand
- ✅ **Asset Compression** - Gzip/Brotli compression enabled
- ✅ **Tree Shaking** - Unused code eliminated
- ✅ **Caching** - Optimized caching strategies

## Accessibility

- ✅ **ARIA Labels** - Proper ARIA attributes
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Focus Management** - Visible focus indicators
- ✅ **Screen Reader** - Screen reader friendly
- ✅ **Color Contrast** - WCAG AA compliant

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/wallmartins/portfolio-admin/issues)
- Check the [documentation](./TESTING.md)

---

Built with ❤️ using Nuxt 3

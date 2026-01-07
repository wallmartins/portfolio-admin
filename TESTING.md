# Testing Guide

This document provides information about the testing infrastructure and how to run tests in this project.

## Table of Contents

- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Writing Tests](#writing-tests)
- [CI/CD](#cicd)

## Testing Stack

This project uses a comprehensive testing setup:

- **Vitest**: Fast unit and component testing framework
- **@vue/test-utils**: Official Vue testing utilities
- **@testing-library/vue**: Testing library for better component testing
- **Playwright**: End-to-end testing framework
- **MSW (Mock Service Worker)**: API mocking for tests
- **happy-dom**: Lightweight DOM implementation for tests

## Running Tests

### Unit and Component Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests (headless)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# View test report
npm run test:e2e:report

# Install Playwright browsers (first time only)
npx playwright install
```

### Run All Tests

```bash
# Run unit, component, and E2E tests
npm run test && npm run test:e2e
```

## Test Structure

```
tests/
├── setup.ts                    # Global test setup
├── unit/
│   ├── composables/           # Composable tests
│   │   ├── useAuth.test.ts
│   │   └── useApi.test.ts
│   └── components/            # Component tests
│       ├── StatsCard.test.ts
│       └── ActivityFeed.test.ts
└── e2e/                       # End-to-end tests
    ├── auth.spec.ts
    └── dashboard.spec.ts
```

## Writing Tests

### Unit Tests (Composables)

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '~/composables/useAuth'

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should initialize with null user', () => {
    const { user, isAuthenticated } = useAuth()
    expect(user.value).toBeNull()
    expect(isAuthenticated.value).toBe(false)
  })
})
```

### Component Tests

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatsCard from '~/components/features/dashboard/StatsCard.vue'

describe('StatsCard', () => {
  it('should render with required props', () => {
    const wrapper = mount(StatsCard, {
      props: {
        title: 'Total Posts',
        value: 42,
        icon: SomeIcon
      }
    })

    expect(wrapper.text()).toContain('Total Posts')
    expect(wrapper.text()).toContain('42')
  })
})
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('should display dashboard page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Dashboard')).toBeVisible()
  })
})
```

## Test Coverage

We aim for >70% test coverage across the codebase. Coverage reports are generated in the `coverage/` directory.

View coverage reports:
```bash
npm run test:coverage
# Open coverage/index.html in browser
```

## Mocking APIs

We use route mocking in E2E tests:

```typescript
await page.route('**/portfolio/blog*', async route => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      data: [],
      meta: { total: 0 }
    })
  })
})
```

## CI/CD

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

The CI pipeline includes:
1. **Lint**: ESLint checks
2. **Unit Tests**: Vitest with coverage
3. **E2E Tests**: Playwright tests
4. **Build**: Production build verification

See `.github/workflows/ci.yml` for details.

## Error Boundary

The application includes an `ErrorBoundary` component that catches and displays errors gracefully:

```vue
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Sentry Integration (Optional)

To enable error tracking in production:

1. Create a Sentry account and project
2. Set the `SENTRY_DSN` environment variable
3. Deploy - errors will be automatically tracked

```bash
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what users see and interact with
2. **Use Data Test IDs**: Add `data-testid` attributes for critical elements
3. **Keep Tests Isolated**: Each test should be independent
4. **Mock External Dependencies**: Don't make real API calls in tests
5. **Test User Flows**: E2E tests should cover complete user journeys
6. **Maintain Coverage**: Add tests when adding new features

## Debugging Tests

### Vitest

```bash
# Run specific test file
npm run test -- useAuth.test.ts

# Run tests matching pattern
npm run test -- --grep "should login"

# Debug with UI
npm run test:ui
```

### Playwright

```bash
# Run with headed browser
npx playwright test --headed

# Run specific test
npx playwright test auth.spec.ts

# Debug mode
npx playwright test --debug

# Generate test code
npx playwright codegen http://localhost:3000
```

## Troubleshooting

### Tests fail with "Cannot find module"

Run `npm run postinstall` to regenerate Nuxt auto-imports.

### E2E tests timeout

Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60000 // 60 seconds
```

### Coverage not generating

Install coverage provider:
```bash
npm install -D @vitest/coverage-v8
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

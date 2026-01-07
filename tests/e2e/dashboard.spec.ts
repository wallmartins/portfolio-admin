import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ context }) => {
    // Set authenticated state for all dashboard tests
    await context.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        accessToken: 'mock-token',
        avatar: 'https://avatar.url'
      }))
    })
  })

  test('should display dashboard page', async ({ page }) => {
    // Mock API responses
    await page.route('**/portfolio/blog*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          meta: { total: 0, current_page: 1, last_page: 1, per_page: 15 }
        })
      })
    })

    await page.route('**/portfolio/projects*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          meta: { total: 0, current_page: 1, last_page: 1, per_page: 10 }
        })
      })
    })

    await page.route('**/portfolio/techs', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      })
    })

    await page.route('**/portfolio/social', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] })
      })
    })

    await page.goto('/')

    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Total Posts')).toBeVisible()
    await expect(page.locator('text=Total Projects')).toBeVisible()
    await expect(page.locator('text=Technologies')).toBeVisible()
    await expect(page.locator('text=Social Links')).toBeVisible()
  })

  test('should display stats cards with correct values', async ({ page }) => {
    await page.route('**/portfolio/blog*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          meta: { total: 15, current_page: 1, last_page: 1, per_page: 15 }
        })
      })
    })

    await page.route('**/portfolio/projects*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          meta: { total: 8, current_page: 1, last_page: 1, per_page: 10 }
        })
      })
    })

    await page.route('**/portfolio/techs', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: Array(12).fill({}) })
      })
    })

    await page.route('**/portfolio/social', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: Array(5).fill({}) })
      })
    })

    await page.goto('/')

    // Wait for stats to load and check values
    await page.waitForSelector('text=15', { timeout: 5000 })
    await expect(page.locator('text=15')).toBeVisible()
    await expect(page.locator('text=8')).toBeVisible()
    await expect(page.locator('text=12')).toBeVisible()
    await expect(page.locator('text=5')).toBeVisible()
  })

  test('should display quick actions', async ({ page }) => {
    await page.route('**/portfolio/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], meta: { total: 0 } })
      })
    })

    await page.goto('/')

    await expect(page.locator('text=Quick Actions')).toBeVisible()
    await expect(page.locator('text=New Post')).toBeVisible()
    await expect(page.locator('text=New Project')).toBeVisible()
    await expect(page.locator('text=Add Technology')).toBeVisible()
    await expect(page.locator('text=Add Social Link')).toBeVisible()
  })

  test('should navigate to create post page from quick action', async ({ page }) => {
    await page.route('**/portfolio/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], meta: { total: 0 } })
      })
    })

    await page.goto('/')

    await page.click('text=New Post')
    await expect(page).toHaveURL(/.*posts\/create/)
  })
})

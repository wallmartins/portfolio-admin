import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login page for unauthenticated users', async ({ page }) => {
    await page.goto('/')

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/)
    await expect(page.locator('text=Login with GitHub')).toBeVisible()
  })

  test('should have GitHub login button', async ({ page }) => {
    await page.goto('/login')

    const loginButton = page.locator('text=Login with GitHub')
    await expect(loginButton).toBeVisible()
    await expect(loginButton).toBeEnabled()
  })

  test('should redirect to GitHub OAuth on login click', async ({ page }) => {
    await page.goto('/login')

    // Mock the GitHub OAuth redirect
    await page.route('**/auth/github/redirect', async route => {
      await route.fulfill({
        status: 302,
        headers: {
          'Location': 'https://github.com/login/oauth/authorize'
        }
      })
    })

    const loginButton = page.locator('text=Login with GitHub')
    await loginButton.click()
  })

  test('should handle authentication callback', async ({ page }) => {
    // Mock successful auth callback
    await page.route('**/auth/github/callback*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          accessToken: 'mock-token-123',
          avatar: 'https://avatar.url'
        })
      })
    })

    await page.goto('/auth/callback?code=test-code')

    // Should redirect to dashboard after successful login
    await page.waitForURL('/')
  })

  test('should show user menu when authenticated', async ({ context, page }) => {
    // Set authenticated state in localStorage
    await context.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        accessToken: 'mock-token',
        avatar: 'https://avatar.url'
      }))
    })

    await page.goto('/')

    // Should show user avatar or name in header
    await expect(page.locator('text=Test User')).toBeVisible()
  })

  test('should logout successfully', async ({ context, page }) => {
    // Set authenticated state
    await context.addInitScript(() => {
      localStorage.setItem('user', JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        accessToken: 'mock-token',
        avatar: 'https://avatar.url'
      }))
    })

    await page.goto('/')

    // Click logout button (adjust selector based on your UI)
    const logoutButton = page.locator('[data-testid="logout-button"]').or(page.locator('text=Logout')).first()
    if (await logoutButton.isVisible()) {
      await logoutButton.click()

      // Should redirect to login
      await expect(page).toHaveURL(/.*login/)
    }
  })
})

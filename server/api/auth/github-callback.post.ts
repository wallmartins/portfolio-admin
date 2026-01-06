export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { code } = await readBody(event)

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'Missing authorization code'
    })
  }

  try {
    // Exchange code for access token
    const tokenResponse = await $fetch<{
      access_token: string
      token_type: string
      scope: string
    }>('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: {
        client_id: config.public.githubClientId,
        client_secret: config.githubClientSecret,
        code
      }
    })

    const accessToken = tokenResponse.access_token

    // Get user info from GitHub
    const githubUser = await $fetch<{
      id: number
      login: string
      name: string
      email: string
      avatar_url: string
    }>('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    })

    // Authenticate with your backend API
    const authResponse = await $fetch<{
      token: string
      user: {
        id: number
        email: string
        name: string
        github_id: string
        avatar_url: string
      }
    }>(`${config.public.apiUrl}/admin/auth/github`, {
      method: 'POST',
      body: {
        github_id: githubUser.id.toString(),
        email: githubUser.email,
        name: githubUser.name || githubUser.login,
        avatar_url: githubUser.avatar_url
      }
    })

    return authResponse
  } catch (error: any) {
    console.error('GitHub OAuth error:', error)
    throw createError({
      statusCode: 401,
      message: error.message || 'Authentication failed'
    })
  }
})

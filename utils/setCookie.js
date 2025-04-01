export const setAuthCookie = (res, token) => {
    console.log('Setting cookie with token:', token) // Debug log
    res.setHeader(
        'Set-Cookie',
        `auth-token=${token}; HttpOnly; Path=/; SameSite=strict; Max-Age=${60 * 60 * 24 * 7}`
    )
}
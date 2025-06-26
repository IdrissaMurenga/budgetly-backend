export const setAuthCookie = (res, token) => {
    res.setHeader(
        'Set-Cookie',`auth-token=${token}; HttpOnly; Path=/; SameSite=strict; Max-Age=${60 * 60 * 24 * 7}`
    )
}
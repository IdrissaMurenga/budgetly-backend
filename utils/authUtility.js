import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET, { expiresIn: '7d' })
}



export const setAuthCookie = (res, token) => {
    console.log('Setting cookie with token:', token) // Debug log
    res.setHeaders(
        'Set-Cookie',
        `auth-token=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
    )
}
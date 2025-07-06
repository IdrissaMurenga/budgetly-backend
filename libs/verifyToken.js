import jwt from 'jsonwebtoken'

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_JWT_SECRET)
    } catch (error) {
        throw new Error('Invalid token')
    }
}

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.REFRESH_JWT_SECRET)
    } catch (error) {
        throw new Error('Invalid token')
    }
}
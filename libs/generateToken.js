import jwt from 'jsonwebtoken'

export const generateToken = (userId) => {
    const accessToken = jwt.sign({ id: userId }, process.env.ACCESS_JWT_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: userId }, process.env.REFRESH_JWT_SECRET, { expiresIn: '7d' })

    return { accessToken, refreshToken }
}
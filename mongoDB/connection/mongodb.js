import mongoose from 'mongoose'

export const mongoDBconnect = (app) => {
    const mongodb_uri = process.env.MONGODB_URI
    mongoose.connect(mongodb_uri)
        .then(async () => {
            const port = process.env.PORT
            app.listen(port, () => console.log(`Server is running at http://localhost:${port}.......`))
        })
        .catch(error => console.error('MongoDB connection error:', error))
}
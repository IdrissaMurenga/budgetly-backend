import mongoose from "mongoose";
import { seedCategories } from "../../utils/seedCategories.js";

export const mongoDBconnect = (app) => {
    const mongodb_url = process.env.MONGODB_URL;

    // Connect to MongoDB
    mongoose.connect(mongodb_url)
        .then(async () => {
            const port = process.env.PORT;
            await seedCategories();
            app.listen(port, () => console.log(`Server is running at http://localhost:${port}......`));
        })
        .catch(error => console.error("MongoDB connection error:", error));
}

import { defaultCategories } from "./defaultCategories.js";
import Category from "../db/models/categoryModel.js";


export const seedCategories = async () => {
    try {
        for (const category of defaultCategories) {
            await Category.updateOne(
                {
                    name: category.name,
                    type: category.type,
                },
                {
                    $setOnInsert: {
                        icon: category.icon,
                    },
                },
                { upsert: true }
            )
        }
    } catch (error) {
        console.error("❌ Error seeding categories:", error.message)
    }
}
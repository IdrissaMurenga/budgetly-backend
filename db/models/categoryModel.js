import mongoose from "mongoose";        
const {Schema, model} = mongoose

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["expense", "income", "other"],
        required: true
    },
}, { timestamps: true })

const Category = model('Category', categorySchema)

export default Category
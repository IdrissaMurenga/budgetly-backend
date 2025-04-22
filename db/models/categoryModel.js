import mongoose from "mongoose";        
const {Schema, model} = mongoose

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["expense", "income"],
        required: true
    },
})

categorySchema.index({ name: 1, type: 1 }, { unique: true })

const Category = model('Category', categorySchema)

export default Category
import mongoose from "mongoose";

const { Schema, model } = mongoose

const budgetSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    savingsGoal: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Budget = model('Budget', budgetSchema)

export default Budget
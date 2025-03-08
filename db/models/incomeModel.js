import mongoose from "mongoose";

const { Schema, model } = mongoose

const incomeSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: {
            values: ['Afritic Group', 'Freelance'],
            message: '{VALUE} is not a valid expense type'
        },
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{ timestamps: true })

const Income = model('income', incomeSchema)

export default Income;
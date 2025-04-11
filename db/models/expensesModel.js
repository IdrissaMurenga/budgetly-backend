import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const expensesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
}, { timestamps: true })

const Expenses = model('expenses', expensesSchema)

export default Expenses  
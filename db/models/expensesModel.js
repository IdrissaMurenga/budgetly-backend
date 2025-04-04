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
    category: {
        type: String,
        enum: {
            values: ['transportation', 'rent', 'utilities', 'foods'],
            message: '{VALUE} is not a valid expense type'
        },
        required: true
    },
}, { timestamps: true })

const Expenses = model('expenses', expensesSchema)

export default Expenses  
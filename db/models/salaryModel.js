import mongoose from 'mongoose'

const { Schema, model } = mongoose

const salarySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ['USD', 'BIF'],
        default: 'USD',
        required: true
    }
}, { timestamps: true })

const Salary = model('salary', salarySchema)

export default Salary
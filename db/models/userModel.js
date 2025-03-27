import mongoose from "mongoose";

const { Schema, model } = mongoose

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    resetPasswordToken: {
        type: String,
    }
},{ timestamps: true })

const User = model('User', userSchema)

export default User
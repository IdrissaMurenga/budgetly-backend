import bcrypt from "bcryptjs";
import User from "../../db/models/userModel.js";
import { GraphQLError } from "graphql";
import Expenses from "../../db/models/expensesModel.js";
import Income from "../../db/models/incomeModel.js";
import { generateToken } from "../../libs/generateToken.js";
import { setAuthCookie } from "../../libs/setCookie.js";
import { authCheck } from "../../utils/authCheck.js";
import Salary from "../../db/models/salaryModel.js";


export default {
    Query: {
        me: async (_, __, context) => {
            // Check if user is authenticated.
            if (!context?.user) {
                throw new GraphQLError('user not authenticated')
            }
            
            // Find the user in database using their id.
            const user = await User.findById(context.user.id)

            // If user not found, throw an error.
            if (!user) {
                throw new GraphQLError("User not found")
            }

            return user
        },
    }, 
    User: {
        expenses: async (parent) => await Expenses.find({ user: parent.id }),
        incomes: async (parent) => await Income.find({ user: parent.id }),
        salary: async (parent) => await Salary.findOne({user: parent.id})
    },
    Mutation: {
        signup: async (_, { input }, context) => {
            const { firstName, lastName, email, password } = input
            
            // Check if all required fields are provided.
            if (!firstName || !lastName || !email || !password) {
                throw new GraphQLError("All fields are required.")
            }

            try {
                const normalEmail = email.toLowerCase()

                // Check if email already exists.
                const existingUser = await User.findOne({ email: normalEmail })

                // If user exists, throw an error.
                if (existingUser) {
                    throw new GraphQLError("user already exists.")
                }
                
                // Hash the password using bcryptjs.
                const hashedPassword = await bcrypt.hash(password, 10)
                
                // Create a new user with the hashed password.
                const user = new User({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                })
                
                // Save the user to the database.
                await user.save()
                
                // Generate a JWT token for the authenticated user.
                const token = generateToken(user._id)

                // Set the JWT token as a cookie in the response.
                setAuthCookie(context.res, token)

                // Return the user and the JWT token.
                return { user, token }

            } catch (error) {
                throw new GraphQLError(error.message);
            }
        },
        login: async (_, { input }, context) => {
            const { email, password } = input

            // Check if all required fields are provided.
            if (!email ||!password) {
                throw new GraphQLError("All fields are required.")
            }

            try {
                // Find the user by email.
                const user = await User.findOne({ email })
                
                // If user not found, throw an error.
                if (!user) {
                    throw new GraphQLError("User not found.")
                }
                
                // Compare the hashed password with the provided password.
                const isMatch = await bcrypt.compare(password, user.password)
                
                // If password does not match, throw an error.
                if (!isMatch) {
                    throw new GraphQLError("incorrect password.", {
                        extensions : {code: "INVALID_CREDENTIALS"}
                    })
                }
                
                // Generate a JWT token for the authenticated user.
                const token = generateToken(user._id)

                // Set the JWT token as a cookie in the response.
                setAuthCookie(context.res, token)
                
                // Return the JWT token.
                return { user, token }

            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: { code: "INTERNAL_SERVER_ERROR" }
                });
            }
        },
        logout: async (_, __, context) => {
            // Extract res and user from context
            const { res, user } = context;
            
            // Check if user is authenticated.
            if (!user) {
                throw new GraphQLError("user not authenticated.")
            }


            // Clear the auth-token cookie
            res.setHeader("Set-Cookie", "auth-token=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0; Secure");

            return true
        }
    }
}
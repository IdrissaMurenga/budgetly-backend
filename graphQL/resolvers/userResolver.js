import bcrypt from "bcryptjs";
import User from "../../db/models/userModel.js";
import { GraphQLError } from "graphql";
import { generateToken } from "../../utils/generateToken.js";
import Expenses from "../../db/models/expensesModel.js";
import Income from "../../db/models/incomeModel.js";


export default {
    Query: {
        me: async (_, __, context) => {
            // Check if user is authenticated.
            if (!context?.user) {
                throw new GraphQLError("user not authenticated.")
            }
            
            try {

                // Find the user in database using their id.
                const user = await User.findById(context.user.id)

                // If user not found, throw an error.
                if (!user) {
                    throw new GraphQLError("User not found")
                }

                return user
            } catch (error) {
                throw new GraphQLError(`Error fetching user: ${error.message}`)
            }
        },
    }, 
    User: {
        expenses: async (parent) => {
            const expenses = await Expenses.find({ user: parent.id });
            return expenses 
        },
        incomes: async (parent) => {
            const incomes = await Income.find({ user: parent.id })
            return incomes
        }
    },
    Mutation: {
        signup: async (_, { input }) => {
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
                    throw new GraphQLError("user already exist.")
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

                // Return the user and the JWT token.
                return { user, token }

            } catch (error) {
                throw new GraphQLError(`Error creating user: ${error.message}`);
            }
        },
        login: async (_, { input }) => {
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
                
                // Return the JWT token.
                return { user, token }

            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: { code: "INTERNAL_SERVER_ERROR" }
                });
            }
        },
    }
}
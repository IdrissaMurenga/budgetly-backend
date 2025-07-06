import bcrypt from "bcryptjs";
import User from "../../mongoDB/models/userModel.js";
import { GraphQLError } from "graphql";
import { generateToken } from "../../libs/generateToken.js";

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
                const {accessToken, refreshToken} = generateToken(user._id)

                // Return the user and the JWT token.
                return { user, accessToken, refreshToken }

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
                const {accessToken, refreshToken} = generateToken(user._id)

                // Return the JWT token.
                return { user, accessToken, refreshToken }

            } catch (error) {
                throw new GraphQLError(error.message, {
                    extensions: { code: "INTERNAL_SERVER_ERROR" }
                });
            }
        },
    }
}
import Income from "../../db/models/incomeModel.js"
import { GraphQLError } from "graphql"


export default {
    Query: {
        incomes: async (_, __, context) => {
            if (!context?.user) {
                throw new GraphQLError("User not authenticated.")
            }
            try {
                const income = await Income.find({ user: context.user.id }) || []
                return income
            } catch (error) {
                throw new GraphQLError(error.message)
            }
        }
    },
    Mutation: {
        addIncome: async (_, { input }, context) => {
            if (!context?.user) {
                throw new GraphQLError("User not authenticated.")
            }
            try {
                const newIncome = new Income({...input, user: context.user.id })
                await newIncome.save()
                return newIncome
            } catch (error) {
                throw new GraphQLError(error.message)
            }
        },
        updateIncome: async (_, { id, input }, context) => {
            if (!context?.user) {
                throw new GraphQLError("User not authenticated.")
            }
            
            try {
                const income = await Income.findByIdAndUpdate({ _id: id, user: context.user.id }, { ...input }, { new: true, runValidators: true })
                

                if (!income) {
                    throw new GraphQLError("Income not found.")
                }

                return income

            } catch (error) {
                throw new GraphQLError(error.message)
            }
        },

        deleteIncome: async (_, { id }, context) => {
            if (!context?.user) {
                throw new GraphQLError("User not authenticated.")
            }

            try {
                const income = await Income.findByIdAndDelete(id)
                if (!income) {
                    throw new GraphQLError("Income not found.")
                }
                return true
            } catch (error) {
                throw new GraphQLError(error.message)
            }
        }
    }
}
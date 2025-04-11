import Income from "../../db/models/incomeModel.js"
import { GraphQLError } from "graphql"
import Category from "../../db/models/categoryModel.js"


export default {
    Query: {
        incomes: async (_, __, context) => {
            if (!context?.user) {
                throw new GraphQLError("User not authenticated.")
            }
            try {
                const income = await Income.find({ user: context.user.id })
                return income
            } catch (error) {
                throw new GraphQLError(error.message)
            }
        }
    },
    Income: {
        // user: async (parent) => {
        //     return await User.findById(parent.user).select("-password -__v")
        // },
        category: async (parent) => {
            return await Category.findById(parent.categoryId)
        },
    },
    Mutation: {
        addIncome: async (_, { input }, context) => {
            const { categoryName, ...rest } = input

            if (!context?.user) {
                throw new GraphQLError("User not authenticated.")
            }
            try {
                const category = await Category.findOne({
                    name: categoryName,
                    user: context.user.id,
                    type: "income"
                })
                if (!category) {
                    throw new GraphQLError("Category not found or not an income category.")
                }
                const newIncome = new Income({
                    ...rest,
                    categoryId: category._id,
                    user: context.user.id
                })
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
import Income from "../../db/models/incomeModel.js"
import { GraphQLError } from "graphql"
import Category from "../../db/models/categoryModel.js"
import { authCheck } from "../../utils/authCheck.js"
import { checkSalary } from "../../utils/checkSalary.js"


export default {
    Query: {
        incomes: async (_, __, context) => {
            authCheck(context)
            try {
                const income = await Income.find({ user: context.user.id })
                return income
            } catch (error) {
                throw new GraphQLError(error.message)
            }
        }
    },
    Income: {
        category: async (parent) => {
            return await Category.findById(parent.categoryId)
        },
    },
    Mutation: {
        addIncome: async (_, { input }, context) => {
            const { categoryId, ...rest } = input
            authCheck(context)
            try {
                const category = await Category.findOne({
                    name: categoryId,
                    type: "income"
                })
                if (!category) {
                    throw new GraphQLError("Category not found or not an income category.")
                }
                if (category.name === 'Savings') {
                    await checkSalary(context.user.id, rest.amount)
                }
                const newIncome = new Income({
                    ...rest,
                    categoryId: category._id,
                    user: context.user.id
                })
                return await newIncome.save()
            } catch (error) {
                throw new GraphQLError(error.message)
            }
        },
        updateIncome: async (_, { id, input }, context) => {
            authCheck(context)
            
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
            authCheck(context)
            try {
                const income = await Income.findByIdAndDelete({ _id: id, user: context.user.id })
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
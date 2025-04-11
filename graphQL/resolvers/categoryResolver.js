import Expenses from "../../db/models/expensesModel.js";
import Income from "../../db/models/incomeModel.js";
import Category from "../../db/models/categoryModel.js";
import { GraphQLError } from "graphql";


export default {
    Query: {
        categories: async (_, __, context) => {
            if (!context?.user) {
                throw new GraphQLError("User not authenticated.")
            }
            try {
                const categories = await Category.find({ user: context.user.id })
                return categories
            } catch (error) {
                throw new GraphQLError(error.message)
            }
        }
    },
    // Mutation: {
    //     addCategory: async (_, { input }, context) => {
    //         if (!context?.user) {
    //             throw new GraphQLError("User not authenticated.")
    //         }
    //         try {
    //             const newCategory = new Category({ ...input, user: context.user.id })
    //             return await newCategory.save()
    //         } catch (error) {
    //             throw new GraphQLError(error.message)
    //         }
    //     }
    // }
}
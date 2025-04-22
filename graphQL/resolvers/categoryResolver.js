import Expenses from "../../db/models/expensesModel.js";
import Income from "../../db/models/incomeModel.js";
import Category from "../../db/models/categoryModel.js";
import { GraphQLError } from "graphql";


export default {
    Query: {
        categories: async (_, {type}, context) => {
            if (!context?.user) {
                throw new GraphQLError("User not authenticated.")
            }
            try {
                const categories = await Category.find({ type })
                return categories
            } catch (error) {
                throw new GraphQLError(error.message)
            }
        }
    },
}
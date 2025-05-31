import Category from "../../db/models/categoryModel.js";
import { GraphQLError } from "graphql";
import { authCheck } from "../../utils/authCheck.js";


export default {
    Query: {
        categories: async (_, __, context) => {
            authCheck(context)
            try {
                const categories = await Category.find()
                return categories
            } catch (error) {
                throw new GraphQLError(error.message)
            }
        }
    },
}
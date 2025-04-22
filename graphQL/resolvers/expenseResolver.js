import Category from "../../db/models/categoryModel.js";
import Expenses from "../../db/models/expensesModel.js";
import { GraphQLError } from "graphql";

export default {
    Query: {
        expenses: async (_, __, context) => {
            if (!context?.user) throw new GraphQLError("User not authenticated.");
            try {
                const expense = await Expenses.find({ user: context.user.id});
                return expense
            } catch (error) {
                throw new GraphQLError(`Error fetching expenses: ${error.message}`);
            }
        },
    },
    Expense: {
        category: async (parent) => {
            return await Category.findById(parent.categoryId)
        },
    },
    Mutation: {
        addExpense: async (_, { input }, context) => {
            const { categoryId, ...rest } = input;
            if (!context?.user) {
                throw new GraphQLError("User not authenticated.");
            }
            try {
                const category = await Category.findOne({
                    name: categoryId,
                    type: "expense"
                });

                if (!category) {
                    throw new GraphQLError("Category not found or not an expenses category.");
                }

                const newExpense = new Expenses({ ...rest, categoryId: category._id, user: context.user.id });

                return await newExpense.save();

            } catch (error) {

                throw new GraphQLError(`Error adding expense: ${error.message}`);
            }
        },

        updateExpense: async (_, { id, input }, context) => {
            if (!context?.user) {
                throw new GraphQLError("User not authenticated.");
            }
            try {
                const updatedExpense = await Expenses.findOneAndUpdate({ _id: id, user: context.user.id }, { ...input }, { new: true, runValidators:true });

                if (!updatedExpense) {
                    throw new GraphQLError("Expense not found or not authorized to update.");
                }
                return updatedExpense;
            } catch (error) {
                throw new GraphQLError(`Error updating expense: ${error.message}`);
            }
        },

        deleteExpense: async (_, { id }, context) => {
            if (!context?.user) {
                throw new GraphQLError("User not authenticated.");
            }
            try {
                const expense = await Expenses.findOneAndDelete({ _id: id, user: context.user.id });
                if (!expense) {
                    throw new GraphQLError("Expense not found.");
                }
                return true;
            } catch (error) {
                throw new GraphQLError(`Error deleting expense: ${error.message}`);
            }
        },
    },
};

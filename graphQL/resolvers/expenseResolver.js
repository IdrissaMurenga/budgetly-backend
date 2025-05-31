import Category from "../../db/models/categoryModel.js";
import Expenses from "../../db/models/expensesModel.js";
import { GraphQLError } from "graphql";
import { authCheck } from "../../utils/authCheck.js";
import { checkSalary } from "../../utils/checkSalary.js";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types

export default {
    Query: {
        expenses: async (_, __, context) => {
            authCheck(context)
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
            authCheck(context)
            try {
                const category = await Category.findOne({
                    name: categoryId,
                    type: "expense"
                });

                if (!category) {
                    throw new GraphQLError("Category not found or not an expenses category.");
                }

                await checkSalary((new ObjectId(context.user.id)), rest.amount)

                const newExpense = new Expenses({ ...rest, categoryId: category._id, user: context.user.id });

                return await newExpense.save();

            } catch (error) {
                throw new GraphQLError(error.message);
            }
        },

        updateExpense: async (_, { id, input }, context) => {
            authCheck(context)
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
            authCheck(context)
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

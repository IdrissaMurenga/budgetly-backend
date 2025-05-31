import { GraphQLError } from "graphql";
import Budget from "../../db/models/budgetModal.js";
import { authCheck } from "../../utils/authCheck.js";
import Salary from "../../db/models/salaryModel.js";

export default {
    Query: {
        getBudget: async (_, { month }, context) => {
            authCheck(context);
            const budget = await Budget.findOne({ user: context.user.id, month });
            return budget;
        }
    },
    Mutation: {
        setBudget: async (_, { input }, context) => {
            authCheck(context);
            const { savingsGoal, month } = input;

            try {
                const salary = await Salary.findOne({ user: context.user.id });
                if (!salary) throw new Error("Salary not found");

                const budgetGoal = salary.amount - savingsGoal;
                if (budgetGoal < 0) throw new Error("Savings exceed salary");
                // const existingBudget = await Budget.findOne({ user: context.user.id, month });
    
                // if (existingBudget) {
                //     throw new GraphQLError('budget already sets')
                // }
    
                const budget = await Budget.findOneAndUpdate(
                    { user: context.user.id, month },
                    {
                        user: context.user.id,
                        salary: salary.id,
                        month,
                        savingsGoal,
                        amount: savingsGoal
                    },
                    { new: true, upsert: true }
                )
    
                return budget
            } catch (error) {
                throw new GraphQLError(error.message);
            }
        }
    }
};
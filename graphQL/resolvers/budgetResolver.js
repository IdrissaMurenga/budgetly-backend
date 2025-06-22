import { GraphQLError } from "graphql";
import Salary from "../../db/models/salaryModel.js";
import Budget from "../../db/models/budgetModal.js";
import { authCheck } from "../../utils/authCheck.js";
import { calculateBudgetAmount } from "../../utils/calculateBudgetAmount.js";

export default {
    Query: {
        getBudget: async (_, { month }, context) => {
            authCheck(context);
            const budget = await Budget.findOne({ user: context.user.id, month });
            return budget;
        },
        getCurrentBudget: async (_, __, context) => {
            authCheck(context);
            const currentMonth = new Date().toISOString().slice(0, 7);
            return await Budget.findOne({ user: context.user.id, month: currentMonth });
        }
    },
    Mutation: {
        setBudget: async (_, { input }, context) => {
            const { amount, month, method, percentage } = input;
            authCheck(context);

            try {
                const salary = await Salary.findOne({ user: context.user.id });
                if (!salary) {
                    throw new GraphQLError("Please set your salary first");
                }

                let budgetAmount;
                let allocation = null;

                switch (method) {
                    case 'RULE_50_30_20':
                        budgetAmount = salary.amount;
                        allocation = {
                            needs: salary.amount * 0.5,
                            wants: salary.amount * 0.3,
                            savings: salary.amount * 0.2,
                            total: salary.amount
                        };
                        break;
                    case 'PERCENTAGE':
                        if (!percentage || percentage <= 0 || percentage > 100) {
                            throw new GraphQLError("Invalid percentage");
                        }
                        budgetAmount = (salary.amount * percentage) / 100;
                        break;
                    case 'CUSTOM':
                        if (!amount || amount <= 0) {
                            throw new GraphQLError("Invalid amount");
                        }
                        budgetAmount = amount;
                        break;
                    default:
                        throw new GraphQLError("Invalid budget calculation method");
                }
            const budget = await Budget.findOneAndUpdate(
                { user: context.user.id, month },
                {
                    amount: budgetAmount,
                    calculation: method,
                    percentage: method === 'PERCENTAGE' ? percentage : undefined,
                    allocation: method === 'RULE_50_30_20' ? allocation : null,
                    user: context.user.id
                },
                { new: true, upsert: true }
                );
                
                return budget

            } catch (error) {
                throw new GraphQLError(error.message);
            }
        }
    }
};
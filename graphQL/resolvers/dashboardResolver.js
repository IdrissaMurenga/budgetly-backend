import mongoose from "mongoose";
import Income from "../../db/models/incomeModel.js";
import Expenses from "../../db/models/expensesModel.js";
import Category from "../../db/models/categoryModel.js";
import { authCheck } from "../../utils/authCheck.js";
import Salary from "../../db/models/salaryModel.js";
import Budget from "../../db/models/budgetModal.js";

const { ObjectId } = mongoose.Types

export default {
    Query: {
        getRecentActivity: async (_, __, context) => {
            authCheck(context)
            const userId = new ObjectId(context.user.id)

            const expenses = await Expenses.find({ user: userId })
            .populate('categoryId')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()
        
            const incomes = await Income.find({ user: userId })
            .populate('categoryId')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()
        
            // Combine and sort by createdAt
            const combined = [
                ...expenses.map(expense => ({ ...expense, id: expense._id, type: 'expense', category: expense.categoryId })),
                ...incomes.map(income => ({ ...income, id: income._id, type: 'income', category: income.categoryId }))
            ]
        
            return combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
        },
        getDashboardSummary: async (_, __, context) => {
            authCheck(context)
            const userId = new ObjectId (context.user.id)
            
            // ✅ Total Expenses
            const [expenseAgg] = await Expenses.aggregate([
                { $match: { user: userId } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
            
            // ✅ Total Incomes
            const [incomeAgg] = await Income.aggregate([
                { $match: { user: userId } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
            
            // ✅ Salary
            const salary = await Salary.findOne({ user: context.user.id })
            const budget = await Budget.findOne({ user: context.user.id })
            
            // ✅ Calculations
            const totalExpenses = expenseAgg?.total || 0;
            const totalIncomes = incomeAgg?.total || 0;
            const totalSalary = salary?.amount || 0;
            const availableBalance = totalSalary - totalExpenses;

            
            return {
                totalExpenses,
                totalIncomes,
                availableBalance,
            }
        },
    }
}
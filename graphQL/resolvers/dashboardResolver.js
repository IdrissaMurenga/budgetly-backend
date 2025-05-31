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
                { $match: { user: userId } },  // get expenses sum to only a specific user
                { $group: { _id: null, total: { $sum: '$amount' } } } //calculate total sum of all expense amount
            ])
            
            // ✅ Total Incomes
            const [incomeAgg] = await Income.aggregate([
                { $match: { user: userId } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
            
            // ✅ Total Savings (only from 'Savings' category)
            const savingsCategory = await Category.findOne({ name: 'Savings', type: 'income' })
            let savingsAgg = []
            if (savingsCategory) {
                // sum all savinge of amounts for the same user
                [savingsAgg] = await Income.aggregate([
                    { $match: { user: userId, categoryId: savingsCategory._id } },
                    { $group: { _id: null, total: { $sum: "$amount" } } }
                ]);
            }
            
            // ✅ Salary
            const salary = await Salary.findOne({ user: context.user.id })

            // ✅ Budget (to show progress)
            const currentMonth = new Date().toISOString().slice(0, 7);
            const budget = await Budget.findOne({ user: context.user.id, month: currentMonth });

            const last7daysDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            const last24hoursDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            const last30daysDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

            // ✅ Bar Chart – Expenses over last 7 days
            const expensesOverViewDate = (date) => ([
                { $match: { user: userId, createdAt: { $gte: date } } },
                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: "$createdAt" } }, total: { $sum: '$amount' } } },
                { $sort: { _id: 1 } },
                { $project: { id: "$_id", total: 1, _id: 0 } }
            ])

            // Add these to your function:
            const last7days = await Expenses.aggregate(expensesOverViewDate(last7daysDate));
            const last24hours = await Expenses.aggregate(expensesOverViewDate(last24hoursDate));
            const last30days = await Expenses.aggregate(expensesOverViewDate(last30daysDate));


            // ✅ Pie Chart – Spending by category
            const pieChartData = await Expenses.aggregate([
                { $match: { user: userId } },
                { $group: { _id: "$categoryId", total: { $sum: "$amount" }}},
                { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "category" }},
                { $unwind: {path: "$category", preserveNullAndEmptyArrays: false} },
                {
                    $project: {
                        _id: 0,
                        category: {
                            id: '$category.id',
                            name: '$category.name',
                            type: '$category.type',
                            icon: '$category.icon',
                        },
                        total: 1
                    }
                }
            ])
            
            // ✅ Calculations
            const totalExpenses = expenseAgg?.total || 0;
            const totalIncomes = incomeAgg?.total || 0;
            const totalSavings = savingsAgg?.total || 0;
            const salaryAmount = salary?.amount || 0;
            const salaryCurrentBalance = salaryAmount - totalExpenses
            
            // ✅ Budget progress ring (percentage)
            const budgetGoal = budget?.amount || 0;
            const budgetProgress = budgetGoal > 0 ? Math.min((totalExpenses / budgetGoal) * 100, 100) : 0;

            return {
                totalExpenses,
                totalIncomes,
                totalSavings,
                salaryCurrentBalance,
                last7days,
                last24hours,
                last30days,
                pieChartData,
                budgetGoal,
                budgetProgress: Math.round(budgetProgress)
            }
        },
    }
}
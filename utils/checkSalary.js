import { GraphQLError } from "graphql";
import Salary from "../db/models/salaryModel.js";
import Expenses from "../db/models/expensesModel.js";

export const checkSalary = async (userId, amount) => {
    const salary = await Salary.findOne({ user: userId })

    const [expenseAgg] = await Expenses.aggregate([
        { $match: { user: userId } },  // get expenses sum to only a specific user
        { $group: { _id: null, total: { $sum: '$amount' } } } //calculate total sum of all expense amount
    ])

    const salaryAmount = salary?.amount || 0
    const totalExpense = expenseAgg?.total || 0
    const salaryCurrentBalance = salaryAmount - totalExpense

    if (!salary) {
        throw new GraphQLError('Salary not found. Please set your monthly salary first.')
    }

    if (amount > salary.amount) {
        throw new GraphQLError('Amount exceeds your current salary')
    }

    if (salaryCurrentBalance === 0) {
        throw new GraphQLError('no balance rest on your account')
    }
}
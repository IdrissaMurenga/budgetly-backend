import userResolver from "./userResolver.js";
import expenseResolver from "./expenseResolver.js";
import incomeResolver from "./incomeResolver.js";
import categoryResolver from "./categoryResolver.js";
import dashboardResolver from "./dashboardResolver.js";
import salaryResolver from "./salaryResolver.js";
import budgetResolver from "./budgetResolver.js";


export const resolvers = {
    Query: {
        ...userResolver.Query,
        ...expenseResolver.Query,
        ...incomeResolver.Query,
        ...categoryResolver.Query,
        ...dashboardResolver.Query,
        ...salaryResolver.Query,
        ...budgetResolver.Query
    },
    User: userResolver.User,
    Expense: expenseResolver.Expense,
    Income: incomeResolver.Income,
    Mutation: {
        ...userResolver.Mutation,
        ...expenseResolver.Mutation,
        ...incomeResolver.Mutation,
        ...salaryResolver.Mutation,
        ...budgetResolver.Mutation
    }
}
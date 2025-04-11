import userResolver from "./userResolver.js";
import expenseResolver from "./expenseResolver.js";
import incomeResolver from "./incomeResolver.js";
import categoryResolver from "./categoryResolver.js";


export const resolvers = {
    Query: {
        ...userResolver.Query,
        ...expenseResolver.Query,
        ...incomeResolver.Query,
        ...categoryResolver.Query
    },
    User: userResolver.User,
    Expense: expenseResolver.Expense,
    Income: incomeResolver.Income,
    Mutation: {
        ...userResolver.Mutation,
        ...expenseResolver.Mutation,
        ...incomeResolver.Mutation,
        // ...categoryResolver.Mutation
    }
}
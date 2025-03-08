import userResolver from "./userResolver.js";
import expenseResolver from "./expenseResolver.js";
import incomeResolver from "./incomeResolver.js";


export const resolvers = {
    Query: {
        ...userResolver.Query,
        ...expenseResolver.Query,
        ...incomeResolver.Query,
    },
    User: userResolver.User,
    Mutation: {
        ...userResolver.Mutation,
        ...expenseResolver.Mutation,
        ...incomeResolver.Mutation
    }
}
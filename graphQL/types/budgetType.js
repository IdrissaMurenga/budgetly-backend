export const budgetType = `
    type Budget {
        id: ID!
        user: User!
        amount: Float!
        month: String!
        savingsGoal: Float!
        createdAt: String
        updatedAt: String
    }

    input BudgetInput {
        savingsGoal: Float!
        month: String!
    }

    type Query {
        getBudget(month: String!): Budget
    }

    type Mutation {
        setBudget(input: BudgetInput!): Budget!
    }
`

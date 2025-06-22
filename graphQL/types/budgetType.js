export const budgetType = `
    type Budget {
        id: ID!
        user: User!
        month: String!
        amount: Float!
        isActive: Boolean
    }

    input BudgetInput {
        month: String!
        amount: Float
    }

    extend type Query {
        getBudget(month: String!): Budget
        getCurrentBudget: Budget
    }

    extend type Mutation {
        setBudget(input: BudgetInput!): Budget!
    }
`

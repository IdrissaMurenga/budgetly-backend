export const expenseType = `
    type Expense {
        id: ID!
        user: User!
        amount: Float!
        category: String!
    }
    type Query {
        expenses: [Expense]!
    }
    type Mutation {
        addExpense(input: addExpenseInput!): Expense!
        updateExpense(id: ID!, input: updateExpenseInput!): Expense!
        deleteExpense(id: ID!): Boolean
    }
    input addExpenseInput {
        amount: Float!
        category: String!
    }
    input updateExpenseInput {
        amount: Float
        category: String
    }

`
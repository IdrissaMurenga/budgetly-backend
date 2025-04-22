export const expenseType = `
    type Expense {
        id: ID!
        user: User!
        amount: Float!
        description: String
        category: Category
        createdAt: String!
        updatedAt: String!
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
        description: String
        categoryId: ID!
    }
    input updateExpenseInput {
        amount: Float
        description: String
    }

`
export const incomeType = `
    type Income {
        id: ID!
        user: User!
        amount: String!
        description: String
        category: Category
        createdAt: String!
        updatedAt: String!
    }
    type Query {
        incomes: [Income]!
    }
    type Mutation {
        addIncome(input: addIncomeInput!): Income!
        updateIncome(id: ID!, input: updateIncomeInput!): Income!
        deleteIncome(id: ID!): Boolean
    }
    input addIncomeInput {
        amount: Float!
        description: String
        categoryId: ID!
    }
    input updateIncomeInput {
        amount: Float
        description: String
    }
`
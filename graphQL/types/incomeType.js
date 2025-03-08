export const incomeType = `
    type Income {
        id: ID!
        user: User!
        amount: String!
        category: String!
    }
    type Query {
        incomes: [Income]
    }
    type Mutation {
        addIncome(input: createIncomeInput!): Income
        updateIncome(id: ID!, input: updateIncomeInput!): Income
        deleteIncome(id: ID!): Boolean
    }
    input createIncomeInput {
        amount: Float!
        category: String!
    }
    input updateIncomeInput {
        amount: Float
        category: String
    }

`
export const salaryType = `
    type Salary {
        id: ID!
        user: User!
        amount: Float!
        currency: String!
        createdAt: String!
        updatedAt: String!
    }
    type Query {
        salary : Salary!
    }
    type Mutation {
        addSalary(input: SalaryInput!) : Salary!
        updateSalary(id: ID!, input: SalaryInput!) : Salary!
        deleteSalary(id: ID!) : Salary!
    }
    input SalaryInput {
        amount: Float!
        currency: String!
    }
`
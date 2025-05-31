export const userType = `
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        expenses: [Expense]
        incomes: [Income]
        salary: Salary
        budget: Budget
        createdAt: String
    }
    type Query {
        me: User
    }
    type AuthPayload {
        user: User
        token: String!
    }
    type Mutation {
        signup(input: SignupInput) : AuthPayload!
        login(input: LoginInput) : AuthPayload!
        logout: Boolean!
    }
    input SignupInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }
    input LoginInput {
        email: String!
        password: String!
    }
`
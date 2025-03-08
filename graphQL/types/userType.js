export const userType = `
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        avatar: String!
        expenses: [Expense!]!
        incomes: [Income!]!
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
        forgetPassword(input: ForgetPasswordInput) : ForgetPasswordResponse!
        resetPassword(input: ResetPasswordInput) : ResetPasswordResponse!
    }
    type ForgetPasswordResponse {
        success: Boolean!
        message: String!
    }
    type ResetPasswordResponse {
        message: String!
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
    input ForgetPasswordInput {
        email: String!
    }
    input ResetPasswordInput {
        token: String!
        newPassword: String!
    }

`
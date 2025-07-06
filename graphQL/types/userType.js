export const userType = `
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
    }
    type Query {
        me: User
    }
    type AuthPayload {
        user: User
        accessToken: String!
        refreshToken: String!
    }
    type Mutation {
        signup(input: SignupInput) : AuthPayload!
        login(input: LoginInput) : AuthPayload!
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
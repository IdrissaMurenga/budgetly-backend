export const userType = `
    type User {
        id: ID!
        name: String!
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
        name: String!
        email: String!
        password: String!
    }
    input LoginInput {
        email: String!
        password: String!
    }
`
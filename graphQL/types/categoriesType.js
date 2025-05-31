export const CategoryType =`
    type Category {
        id: ID!
        name: String!
        icon: String!
        type: String!
        user: User!
    }
    input CategoryInput {
        name: String!
        type: String!
    }
    type Query {
        categories : [Category!]!
    }
`

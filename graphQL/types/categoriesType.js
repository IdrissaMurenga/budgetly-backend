export const CategoryType =`
    type Category {
        id: ID!
        name: String!
        type: String!
        user: User!
    }
    input CategoryInput {
        name: String!
        type: String!
    }
    type Query {
        categories: [Category]
    }
    type Mutation {
        addCategory(input: CategoryInput!): Category
    }
`

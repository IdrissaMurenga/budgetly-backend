import { GraphQLError } from "graphql"

export const authCheck = (context) => {
    if (!context?.user) throw new GraphQLError('user not authenticated')
}
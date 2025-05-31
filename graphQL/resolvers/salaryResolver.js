import Salary from "../../db/models/salaryModel.js";
import { GraphQLError } from "graphql";
import { authCheck } from "../../utils/authCheck.js";


export default {
    Query: {
        salary: async (_, __, context) => {
            authCheck(context)
            const salary = await Salary.findOne({ user: context.user.id })
            
            if (!salary) throw new GraphQLError("No salary found for this user")
            
            if (salary.amount === null || salary.amount === undefined) {
                throw new GraphQLError("Invalid salary: missing amount")
            }

            return salary
        }
    },
    Mutation: {
        addSalary: async (_, { input }, context) => {
            const { amount, currency } = input
            authCheck(context)
            try {               
                const existingSalary = await Salary.findOne({ user: context.user.id })

                if (existingSalary) throw new GraphQLError("You already set your monthly salary")
                
                const newSalary = new Salary({
                    user: context.user.id,
                    amount,
                    currency
                })

                return await newSalary.save()
            } catch (error) {
                throw new GraphQLError(`Failed to add salary: ${error.message}`)
            }

        },
        updateSalary: async (_, { id, input }, context) => {
            const { amount, currency } = input
            authCheck(context)
            try {
                const salary = await Salary.findOneAndUpdate(
                    { _id: id, user: context.user.id },
                    { amount, currency },
                    { new: true, runValidators: true }
                )
                if (!salary) throw new GraphQLError("Salary not found")
                return salary
            } catch (error) {
                throw new GraphQLError('failed to update salary', error)
            }
        },
        deleteSalary: async (_, { id }, context) => {
            authCheck(context)
            try {
                const salary = await Salary.findByIdAndDelete({ _id: id, user: context.user.id })
                if (!salary) throw new GraphQLError("Salary not found")
                return salary
            } catch (error) {
                throw new GraphQLError('faild delete salary', error)
            }
        }
    }
}
export const dashBoardType = `
    type CategorySpending {
        categoryId: ID!
        name: String!
        amount: Float!
        percentage: Float!
        limit: Float
    }
    type DashboardSummary {
        # Income Summary
        totalIncomes: Float!
        totalSalary: Float!
        availableBlanace: Float!

        # Expense Summary
        totalExpenses: Float!
        topExpenseCategories: [CategorySpending!]!
    }
    type RecentActivity {
        id: ID!
        type: String
        amount: Float!
        category: Category
        description: String
        createdAt: String
    }
    extend type Query {
        getDashboardSummary: DashboardSummary!
        getRecentActivity: [RecentActivity!]!
    }
`;
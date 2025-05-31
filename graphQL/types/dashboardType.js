export const dashBoardType = `
    type DashboardSummary {
        totalIncomes: Float!
        totalExpenses: Float!
        totalSavings: Float!
        salaryCurrentBalance: Float
        last7days: [ChartPoint!]
        last24hours: [ChartPoint!]
        last30days: [ChartPoint!]
        pieChartData: [PieSlice!]
        budgetGoal: Float
        budgetProgress: Float
    }
    type RecentActivity {
        id: ID!
        type: String
        amount: Float!
        category: Category
        description: String
        createdAt: String
    }
    type ChartPoint {
        id: String
        total: Float
    }
    type PieSlice {
        category: Category
        total: Float
    }
    extend type Query {
        getDashboardSummary: DashboardSummary!
        getRecentActivity: [RecentActivity!]!
    }
`;
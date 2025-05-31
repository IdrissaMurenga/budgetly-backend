import { userType } from "./userType.js";
import { expenseType } from "./expenseType.js";
import { incomeType } from "./incomeType.js";
import { CategoryType } from "./categoriesType.js";
import { dashBoardType } from "./dashboardType.js";
import { salaryType } from "./salaryType.js";
import { budgetType } from "./budgetType.js";

export const typeDefs = `
    ${userType}
    ${expenseType}
    ${incomeType}
    ${CategoryType}
    ${dashBoardType}
    ${salaryType}
    ${budgetType}
`
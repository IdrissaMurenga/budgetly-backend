import { userType } from "./userType.js";
import { expenseType } from "./expenseType.js";
import { incomeType } from "./incomeType.js";
import { CategoryType } from "./categoriesType.js";

export const typeDefs = `
    ${userType}
    ${expenseType}
    ${incomeType}
    ${CategoryType}
`
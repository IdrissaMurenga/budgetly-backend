import { userType } from "./userType.js";
import { expenseType } from "./expenseType.js";
import { incomeType } from "./incomeType.js";

export const typeDefs = `
    ${userType}
    ${expenseType}
    ${incomeType}
`
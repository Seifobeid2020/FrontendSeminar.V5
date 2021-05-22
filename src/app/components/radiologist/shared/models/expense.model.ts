import { ExpenseType } from './expense-type.model';

export interface Expense {
  expenseId?: number;
  userId: string;
  expenseValue: number;
  expenseDescription: string;
  createdAt?: Date;

  // expenseTypeName?: string;
  expenseTypeId?: number;

  expenseType?: ExpenseType;
}

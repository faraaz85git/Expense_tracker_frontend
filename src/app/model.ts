export type BudgetStatus = {
  start_date: string;
  end_date: string;
  budget_amount: {
    housing: number;
    transport: number;
    food: number;
    clothing: number;
    other: number;
  };
  amount_spend: {
    housing: number;
    transport: number;
    food: number;
    clothing: number;
    other: number;
  };
  budget_status: {
    housing: number;
    transport: number;
    food: number;
    clothing: number;
    other: number;
  };
};
export type Budget = {
  housing: number;
  transport: number;
  food: number;
  clothing: number;
  other: number;
  start_date: string;
  end_date: string;
};

export type BudgetExist = {
  status: string;
};

// Type Guard for BudgetStatus
export function isBudgetStatus(val: any): val is BudgetStatus {
  return (
    val &&
    typeof val.start_date === 'string' &&
    typeof val.end_date === 'string' &&
    isBudgetAmount(val.budget_amount) &&
    isBudgetAmount(val.amount_spend) &&
    isBudgetAmount(val.budget_status)
  );
}

// Type Guard for BudgetExist
export function isBudgetExist(val: any): val is BudgetExist {
  return (
    val && typeof val.message === 'string' && typeof val.existing === 'boolean'
  );
}

// Helper function for BudgetAmount (same as previous)
export function isBudgetAmount(val: any): val is {
  housing: number;
  transport: number;
  food: number;
  clothing: number;
  other: number;
} {
  return (
    val &&
    typeof val.housing === 'number' &&
    typeof val.transport === 'number' &&
    typeof val.food === 'number' &&
    typeof val.clothing === 'number' &&
    typeof val.other === 'number'
  );
}

export type Expense = {
  exp_id: number;
  date: string;
  category: string;
  amount: number;
  description: string;
};

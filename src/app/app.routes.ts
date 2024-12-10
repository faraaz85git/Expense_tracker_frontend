import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardLayoutComponent } from './dashboard/dashboardlayout/dashboardlayout.component';
import { BudgetLayoutComponent } from './dashboard/budgetlayout/budgetlayout.component';
import { BudgetCardComponent } from './dashboard/budgetcard/budgetcard.component';
import { CreateBudgetComponent } from './dashboard/budgetlayout/createbudget/createbudget.component';
import { ExpenseslistComponent } from './expenseslist/expenseslist.component';
import { ExpenseLayoutComponent } from './dashboard/expense-layout/expense-layout.component';
import { CreateExpenseComponent } from './dashboard/expense-layout/create-expense-modal/create-expense-modal.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'home',
    component: DashboardComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardLayoutComponent,
      },
      {
        path: 'budgets',
        component: BudgetLayoutComponent,
      },
      {
        path: 'expenses',
        component: ExpenseLayoutComponent,
      },
    ],
  },

  
  {
    path: 'create-expense',
    component: CreateExpenseComponent,
  },
  { path: 'home/dashboardlayout', component: DashboardLayoutComponent },

  {
    path: 'budgetcard',
    component: BudgetLayoutComponent,
  },
  {
    path: 'budgetcreate',
    component: CreateBudgetComponent,
  },
];

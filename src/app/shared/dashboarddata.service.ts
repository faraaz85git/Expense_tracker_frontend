import { inject, Injectable, signal } from '@angular/core';
import { BudgetExist, BudgetStatus, isBudgetStatus } from '../model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { BackendService } from '../backenedApi.service';
import { BudgetStatusApi } from '../apis';

@Injectable({
  providedIn: 'root',
})
export class DashboardDataService {
  isfetching = signal(true);
  private backendService = inject(BackendService);
  budget = signal<BudgetStatus>({
    start_date: '2024-10-19',
    end_date: '2024-12-20',
    budget_amount: {
      housing: 0,
      transport: 0,
      food: 0,
      clothing: 0,
      other: 0,
    },
    amount_spend: {
      housing: 0,
      transport: 0,
      food: 0,
      clothing: 0,
      other: 0,
    },
    budget_status: {
      housing: 0,
      transport: 0,
      food: 0,
      clothing: 0,
      other: 0,
    },
  });
  totalBudget = signal<number>(0);
  budgetSpend = signal<number>(0);
  budgetAmountsArray = signal<number[]>([0, 0, 0, 0, 0]);
  amountSpendArray = signal<number[]>([0, 0, 0, 0, 0]);
  categoriesArray = signal<string[]>([
    'housing',
    'transport',
    'food',
    'clothing',
    'other',
  ]);

  constructor(private http: HttpClient) {
    this.loadBudgetData(); // Automatically fetch data when the service is initialized
  }

  // Fetch budget data and update signals
  private loadBudgetData(): void {
    this.backendService
      .get<BudgetStatus | BudgetExist>(BudgetStatusApi)
      .subscribe({
        next: (val) => {
          if (isBudgetStatus(val)) {
            this.budget.set(val);
            this.calculateTotals(val);
          }
        },
        complete:()=>{this.isfetching.set(false)},
        error: (error) => {
          console.log(error);
        },
      });
  }

  // Calculate total budget, total spend, and arrays
  private calculateTotals(data: BudgetStatus): void {
    const { budget_amount, amount_spend } = data;

    this.totalBudget.set(
      Object.values(budget_amount).reduce((acc, val) => acc + val, 0)
    );
    this.budgetSpend.set(
      Object.values(amount_spend).reduce((acc, val) => acc + val, 0)
    );

    this.budgetAmountsArray.set(Object.values(budget_amount));
    this.amountSpendArray.set(Object.values(amount_spend));
    this.categoriesArray.set(Object.keys(budget_amount));

    console.log('Budget Data:', this.budget());
    console.log('Total Budget:', this.totalBudget(), this.budgetAmountsArray());
    console.log('Total Spend:', this.budgetSpend());
    console.log('Categories:', this.categoriesArray());
  }
  calculateBudgetInfoTotals(data: BudgetStatus){
    const { budget_amount, amount_spend } = data;
    let categoriesArray=Object.keys(budget_amount);
    let amountSpendArray=(Object.values(amount_spend));
    let budgetAmountsArray=(Object.values(budget_amount));
    let budgets=[];
    for(let i=0;i<5;i++){
      budgets.push({
        name: categoriesArray[i],
        total:budgetAmountsArray[i],
        spent:amountSpendArray[i],
        remaining:budgetAmountsArray[i] -amountSpendArray[i],
        items: 2,
        end_date:data.end_date,
        start_date:data.start_date,
      })
    }
    return budgets;
  }
}

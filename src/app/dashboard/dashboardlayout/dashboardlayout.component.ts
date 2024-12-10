import { Component, inject, signal } from '@angular/core';
import { BudgetslistComponent } from '../../budgetslist/budgetslist.component';
import { ExpenseslistComponent } from '../../expenseslist/expenseslist.component';
import { BarchartComponent } from '../../barchart/barchart.component';
import { TopbarComponent } from '../../topbar/topbar.component';
import { BudgetExist, BudgetStatus, isBudgetStatus } from '../../model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BackendService } from '../../backenedApi.service';
import { BudgetStatusApi } from '../../apis';

@Component({
  selector: 'app-dashboardlayout',
  imports: [
    ExpenseslistComponent,
    BarchartComponent,
    BudgetslistComponent,
    TopbarComponent,
  ],
  standalone: true,
  templateUrl: './dashboardlayout.component.html',
  styleUrl: './dashboardlayout.component.css',
})
export class DashboardLayoutComponent {
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
      totalBudget=signal<number>(0);
      budgetSpend=signal<number>(0);
      private router = inject(Router);
      private subcription!: Subscription;
      private backendService = inject(BackendService);
    
      ngOnInit() {
        this.subcription = this.backendService
          .get<BudgetStatus | BudgetExist>(BudgetStatusApi)
          .subscribe({
            next: (val) => {
             
              if(isBudgetStatus(val)){
                this.budget.set(val);
                this.updateTotals(val);
              }
              
            },
            error: (error) => {
              console.log(error);
            },
          });
      }
      ngOnDestroy() {
        if (this.subcription) {
          this.subcription.unsubscribe();
        }
      }
    
    
      private updateTotals(budget: BudgetStatus): void {
        // Calculate total budget by summing up all categories
        const totalBudgetAmount = Object.values(budget.budget_amount).reduce((sum, value) => sum + value, 0);
    
        // Calculate total spend by summing up all categories
        const totalSpendAmount = Object.values(budget.amount_spend).reduce((sum, value) => sum + value, 0);
    
        // Update the signals
        this.totalBudget.set(totalBudgetAmount);
        this.budgetSpend.set(totalSpendAmount);
      }  
}

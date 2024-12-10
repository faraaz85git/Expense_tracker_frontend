import { Component, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TopbarComponent } from '../../topbar/topbar.component';
import { BudgetCardComponent } from '../budgetcard/budgetcard.component';
import { DashboardDataService } from '../../shared/dashboarddata.service';
import { NgFor } from '@angular/common';
import { BackendService } from '../../backenedApi.service';
import { Subscription } from 'rxjs';
import { BudgetExist, BudgetStatus, isBudgetStatus } from '../../model';
import { BudgetStatusApi } from '../../apis';
import { CreateBudgetComponent } from './createbudget/createbudget.component';

@Component({
  selector: 'app-budget-layout',
  imports: [TopbarComponent,CreateBudgetComponent, NgFor, BudgetCardComponent],
  standalone: true,
  templateUrl: './budgetlayout.component.html',
  styleUrl: './budgetlayout.component.css',
})
export class BudgetLayoutComponent implements OnInit ,OnDestroy{
  imagesSrc = [
    'https://img.icons8.com/color/48/house-with-a-garden.png',
    'https://img.icons8.com/fluency/48/protected-bike-lane.png',
    'https://img.icons8.com/fluency/48/kawaii-broccoli.png',
    'https://img.icons8.com/color/48/shop-local.png',
    'https://img.icons8.com/arcade/64/online-order.png',
  ];
  isFetching = signal<boolean>(true);
  subscription!: Subscription;
  budgets = signal<any[]>([]);
  private dashboardService = inject(DashboardDataService);
  private backendService = inject(BackendService);
  openModal=false;
  ngOnInit() {
    this.subscription = this.backendService
      .get<BudgetStatus | BudgetExist>(BudgetStatusApi)
      .subscribe({
        next: (val) => {
          if (isBudgetStatus(val)) {
            this.budgets.set(
              this.dashboardService.calculateBudgetInfoTotals(val)
            );
          }
        },
        complete: () => {
          this.isFetching.set(false);
        },
        error: (error) => {},
      });
  }

  toOpenModal(){
    this.openModal=true;
  }
  toCloseModal(){
    this.openModal=false;
  }
  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}

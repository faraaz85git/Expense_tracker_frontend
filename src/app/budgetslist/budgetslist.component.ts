import { DatePipe, NgFor, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { DashboardDataService } from '../shared/dashboarddata.service';
import { BackendService } from '../backenedApi.service';
import { Subscription } from 'rxjs';
import { BudgetExist, BudgetStatus, isBudgetStatus } from '../model';
import { BudgetStatusApi } from '../apis';
import { BudgetCardComponent } from '../dashboard/budgetcard/budgetcard.component';

@Component({
  selector: 'app-budgetslist',
  standalone: true,
  imports: [ BudgetCardComponent],
  templateUrl: './budgetslist.component.html',
  styleUrl: './budgetslist.component.css',
})
export class BudgetslistComponent implements OnInit, OnDestroy {
  imagesSrc = [
    'https://img.icons8.com/color/48/house-with-a-garden.png',
    'https://img.icons8.com/fluency/48/protected-bike-lane.png',
    'https://img.icons8.com/fluency/48/kawaii-broccoli.png',
    'https://img.icons8.com/color/48/shop-local.png',
    'https://img.icons8.com/arcade/64/online-order.png',
  ];
  isFetching = true;
  budgets!: any;
  private dashboardDataService = inject(DashboardDataService);
  private backendService = inject(BackendService);
  private subscription!: Subscription;

  ngOnInit() {
    this.subscription = this.backendService
      .get<BudgetStatus | BudgetExist>(BudgetStatusApi)
      .subscribe({
        next: (val) => {
          if (isBudgetStatus(val)) {
            this.budgets =
              this.dashboardDataService.calculateBudgetInfoTotals(val);
          }
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.isFetching = false;
        },
      });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

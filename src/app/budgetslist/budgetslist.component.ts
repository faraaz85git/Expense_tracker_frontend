import { DatePipe, NgFor, TitleCasePipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DashboardDataService } from '../shared/dashboarddata.service';

@Component({
  selector: 'app-budgetslist',
  standalone: true,
  imports: [DatePipe,TitleCasePipe,NgFor],
  templateUrl: './budgetslist.component.html',
  styleUrl: './budgetslist.component.css',
})
export class BudgetslistComponent {
  imagesSrc = [
    'https://img.icons8.com/color/48/house-with-a-garden.png',
    'https://img.icons8.com/fluency/48/protected-bike-lane.png',
    'https://img.icons8.com/fluency/48/kawaii-broccoli.png',
    'https://img.icons8.com/color/48/shop-local.png',
    "https://img.icons8.com/arcade/64/online-order.png"
  ];
  isFetching = true;
  totalBudget = 0;
  budgetSpend = 0;
  budgetAmountsArray = [0, 0, 0, 0, 0];
  amountSpendArray = [0, 0, 0, 0, 0];
  start_date:string='';
  end_date:string='';
  categoriesArray = ['housing', 'transport', 'food', 'clothing', 'other'];
  // budgets = [
  //   // { name: 'Home Decor', total: 3800, spent: 3300, remaining: 500, items: 3 },
  //   {
  //     name: this.categoriesArray[0],
  //     total: this.budgetAmountsArray[0],
  //     spent: this.amountSpendArray[0],
  //     remaining: this.budgetAmountsArray[0] - this.amountSpendArray[0],
  //     items: 2,
  //   },
  //   {
  //     name: this.categoriesArray[1],
  //     total: this.budgetAmountsArray[1],
  //     spent: this.amountSpendArray[1],
  //     remaining: this.budgetAmountsArray[1] - this.amountSpendArray[1],
  //     items: 2,
  //   },
  //   {
  //     name: this.categoriesArray[2],
  //     total: this.budgetAmountsArray[2],
  //     spent: this.amountSpendArray[2],
  //     remaining: this.budgetAmountsArray[2] - this.amountSpendArray[2],
  //     items: 2,
  //   },
  //   {
  //     name: this.categoriesArray[3],
  //     total: this.budgetAmountsArray[3],
  //     spent: this.amountSpendArray[3],
  //     remaining: this.budgetAmountsArray[3] - this.amountSpendArray[3],
  //     items: 2,
  //   },
  //   {
  //     name: this.categoriesArray[4],
  //     total: this.budgetAmountsArray[4],
  //     spent: this.amountSpendArray[4],
  //     remaining: this.budgetAmountsArray[4] - this.amountSpendArray[4],
  //     items: 2,
  //   },
  // ];
  budgets!: {
    name: string;
    total: number;
    spent: number;
    remaining: number;
    items: number;
  }[];

  private dashboardDataService = inject(DashboardDataService);

  constructor() {
    effect(() => {
      this.isFetching = this.dashboardDataService.isfetching();
      this.totalBudget = this.dashboardDataService.totalBudget();
      this.budgetSpend = this.dashboardDataService.budgetSpend();
      this.categoriesArray = this.dashboardDataService.categoriesArray();
      this.budgetAmountsArray = this.dashboardDataService.budgetAmountsArray();
      this.amountSpendArray = this.dashboardDataService.amountSpendArray();
      this.start_date=this.dashboardDataService.budget().start_date;
      this.end_date=this.dashboardDataService.budget().end_date;

      this.budgets = [
        // { name: 'Home Decor', total: 3800, spent: 3300, remaining: 500, items: 3 },
        {
          name: this.categoriesArray[0],
          total: this.budgetAmountsArray[0],
          spent: this.amountSpendArray[0],
          remaining: this.budgetAmountsArray[0] - this.amountSpendArray[0],
          items: 2,
        },
        {
          name: this.categoriesArray[1],
          total: this.budgetAmountsArray[1],
          spent: this.amountSpendArray[1],
          remaining: this.budgetAmountsArray[1] - this.amountSpendArray[1],
          items: 2,
        },
        {
          name: this.categoriesArray[2],
          total: this.budgetAmountsArray[2],
          spent: this.amountSpendArray[2],
          remaining: this.budgetAmountsArray[2] - this.amountSpendArray[2],
          items: 2,
        },
        {
          name: this.categoriesArray[3],
          total: this.budgetAmountsArray[3],
          spent: this.amountSpendArray[3],
          remaining: this.budgetAmountsArray[3] - this.amountSpendArray[3],
          items: 2,
        },
        {
          name: this.categoriesArray[4],
          total: this.budgetAmountsArray[4],
          spent: this.amountSpendArray[4],
          remaining: this.budgetAmountsArray[4] - this.amountSpendArray[4],
          items: 2,
        },
      ];
    });
  }
}

import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { NgxApexchartsModule, ChartType } from 'ngx-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexPlotOptions,
} from 'ngx-apexcharts';
import { DashboardDataService } from '../shared/dashboarddata.service';
import { Subscription } from 'rxjs';
import { BackendService } from '../backenedApi.service';
import { BudgetExist, BudgetStatus, isBudgetStatus } from '../model';
import { BudgetStatusApi } from '../apis';

@Component({
  selector: 'app-barchart',
  standalone: true,
  imports: [NgxApexchartsModule],
  templateUrl: './barchart.component.html',
  styleUrl: './barchart.component.css',
})
export class BarchartComponent implements OnInit {
  isFetching = true;
  private backendService = inject(BackendService);
  budgetAmountsArray = signal<number[]>([0, 0, 0, 0, 0]);
  amountSpendArray = signal<number[]>([0, 0, 0, 0, 0]);
  categoriesArray = [
    'housing',
    'transport',
    'food',
    'clothing',
    'other',
  ];
  chartSeries: ApexAxisChartSeries = [
  ];
  chartDetails: ApexChart = {
    type: 'bar' as ChartType,
    height: 500,
    stacked: false,
  };
  chartXAxis: ApexXAxis = {
    categories: this.categoriesArray,
  };
  chartDataLabels: ApexDataLabels = {
    enabled: false,
  };

  chartTitle: ApexTitleSubtitle = {
    text: 'Budget overview',
    align: 'left',
  };
  chartColors: string[] = ['#87A6F3', '#6A5BCD'];
  chartPlotOptions: ApexPlotOptions = {
    bar: {
      distributed: false, // Assigns different colors to each bar if needed
      horizontal: false,
      dataLabels: {
        position: 'top', // Displays data labels above the bars
      },
      // Stacking the bars
      // stacked:true; // This stacks the bars on top of each other
    },
  };
  private subcription!: Subscription;

  ngOnInit() {
    this.subcription = this.backendService
      .get<BudgetStatus | BudgetExist>(BudgetStatusApi)
      .subscribe({
        next: (val) => {
          if (isBudgetStatus(val)) {
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
    const { budget_amount, amount_spend } = budget;
    this.chartSeries = [
      {
        name: 'budget set',
        // data: [2700, 2460, 2100, 2390],
        data: Object.values(budget_amount),
      },
      {
        name: 'budget spend',
        // data: [1200, 1500, 1700, 1900],
        data: Object.values(amount_spend),
      },
    ];
  }

}

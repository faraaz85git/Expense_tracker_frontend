import { NgFor, TitleCasePipe } from '@angular/common';
import {
  Component,
  Input,
  inject,
  OnDestroy,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BackendService } from '../backenedApi.service';
import { Expense } from '../model';
import { Subscription } from 'rxjs';
import { DeleteExpenseApi } from '../apis';
import { CreateExpenseComponent } from '../dashboard/expense-layout/create-expense-modal/create-expense-modal.component';

@Component({
  selector: 'app-expenseslist',
  standalone: true,
  imports: [CreateExpenseComponent, NgFor],
  templateUrl: './expenseslist.component.html',
  styleUrl: './expenseslist.component.css',
})
export class ExpenseslistComponent implements OnInit, OnChanges, OnDestroy {
  latestExpenses: Expense[] = [];
  isModalOpen = false;
  editMode = false;
  expenseToEdit: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 90;
  private subscription!: Subscription;
  private backendService = inject(BackendService);
  limit = 10;
  offset = 0;
  @Input() toRefresh: boolean = false;

  ngOnInit() {
    this.fetchExpenses();
  }

  toOpenModal() {
    this.isModalOpen = true;
  }
  toCloseModal() {
    this.isModalOpen = false;
  }
  toEditExpense(editMode: boolean, exp_Id: any) {
    this.editMode = editMode;
    this.expenseToEdit = this.latestExpenses[exp_Id];
    this.isModalOpen = true;
  }
  fetchExpenses(page: number = this.currentPage) {
    this.subscription = this.backendService
      .get<Expense[] | []>(
        'http://127.0.0.1:8000/expense' +
          `?limit=${this.limit}&offset=${this.offset}`
      )
      .subscribe({
        next: (val) => {
          if (val.length < this.itemsPerPage) {
            this.totalPages = page;
          }
          this.latestExpenses = val;
        },
        error: (error) => {
          console.log('error while loading expesne list', error);
        },
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.toRefresh) {
      this.fetchExpenses(this.currentPage);
    }
  }
  toRefreshList() {
    this.toRefresh = true;
  }
  changePage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.offset = (this.currentPage - 1) * 10;
      this.fetchExpenses();
    }
  }

  onDeleteExpense(index: number) {
    const expenseToDelete = this.latestExpenses[index];
    console.log(`Deleting expense:`, expenseToDelete.exp_id);
    this.deleteExpense(expenseToDelete.exp_id);
    this.fetchExpenses(); // Refresh data after deletion
  }

  deleteExpense(exp_id: number) {
    this.subscription = this.backendService
      .delete<null>(DeleteExpenseApi + exp_id)
      .subscribe({
        next: (val) => {
          console.log;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

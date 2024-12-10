import { Component } from '@angular/core';
import { ExpenseslistComponent } from '../../expenseslist/expenseslist.component';
import { CreateExpenseComponent } from './create-expense-modal/create-expense-modal.component';

@Component({
  selector: 'app-expense-layout',
  imports: [CreateExpenseComponent,ExpenseslistComponent],
  templateUrl: './expense-layout.component.html',
  styleUrl: './expense-layout.component.css',
  standalone: true,
})
export class ExpenseLayoutComponent {
  isOpenModal = false;
  toRefresh=false;
  toOpenModal() {
    this.isOpenModal = true;
  }
  toCloseModal() {
    this.isOpenModal=false;
  }
  toUpdateList(){ 
    this.toRefresh=true; 
  }
}

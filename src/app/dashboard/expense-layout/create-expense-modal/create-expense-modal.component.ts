import { NgIf } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  SimpleChanges,
} from '@angular/core';
import { expenseCreateApi, expenseUpdateApi } from '../../../apis';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { BackendService } from '../../../backenedApi.service';
import { Expense } from '../../../model';

function isDatesValid(control: AbstractControl) {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;
  if (startDate && endDate && new Date(endDate) >= new Date(startDate)) {
    return null;
  } else {
    return { isDateInValid: true };
  }
}
@Component({
  selector: 'app-create-expense-modal',
  imports: [NgIf, ReactiveFormsModule, FormsModule],
  standalone: true,
  templateUrl: './create-expense-modal.component.html',
  styleUrl: './create-expense-modal.component.css',
})
export class CreateExpenseComponent implements OnInit, OnDestroy {
  @Input() isEditMode = false;
  @Input() expenseData: Expense | null = null;
  title = 'Create New Expense';
  updateList = output<void>();
  closeModal = output<void>();
  subscription!: Subscription;
  private backendService = inject(BackendService);
  form = new FormGroup({
    amount: new FormControl('', {
      validators: [Validators.required, Validators.min(0)],
    }),
    category: new FormControl('', {
      validators: [Validators.required, Validators.min(0)],
    }),
    name: new FormControl('', { validators: [Validators.required] }),
    date: new FormControl('', { validators: [Validators.required] }),
  });

  
  ngOnInit() {
    if (this.isEditMode && this.expenseData) {
      this.title = 'Edit Expense';
      this.form.patchValue({
        date: this.expenseData.date,
        name: this.expenseData.description,
        category: this.expenseData.category,
        amount: `${this.expenseData.amount}`,
      });
    }
  }
  onSubmitExpenseForm() {
    var apiToCall = expenseCreateApi;
    var dataToPost = this.expenseInfo();

    if (this.isEditMode && this.expenseData) {
      apiToCall = apiToCall + `/${this.expenseData.exp_id}`;
      dataToPost = this.expenseInfo();
      this.subscription = this.backendService
        .patch<{ status: string }>(apiToCall, dataToPost)
        .subscribe({
          next: (val) => {
            window.confirm(`${val.status}`);
            this.updateList.emit();
            this.closeModal.emit();
          },
          error: (error) => {
            window.alert(`${error.error.detail}`);
            this.closeModal.emit();
          },
        });
    } else {
      this.subscription = this.backendService
        .post<{ status: string }>(expenseCreateApi, this.expenseInfo())
        .subscribe({
          next: (val) => {
            window.confirm(`${val.status}`);
            this.updateList.emit();
            this.closeModal.emit();
          },
          error: (error) => {
            window.alert(`${error.error.detail}`);
            this.closeModal.emit();
          },
        });
    }
  }
  expenseInfo() {
    return {
      date: this.form.controls.date.value,
      category: this.form.controls.category.value,
      amount: this.form.controls.amount.value,
      description: this.form.controls.name.value,
    };
  }
  toCloseModal() {
    this.closeModal.emit();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

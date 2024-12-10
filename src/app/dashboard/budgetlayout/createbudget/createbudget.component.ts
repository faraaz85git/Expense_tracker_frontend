import { NgIf } from '@angular/common';
import { Component, inject, OnDestroy, output } from '@angular/core';
import { BudgetSetApi } from '../../../apis';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { BackendService } from '../../../backenedApi.service';

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
  selector: 'app-budget-create',
  imports: [NgIf,ReactiveFormsModule],
  standalone: true,
  templateUrl: './createbudget.component.html',
  styleUrl: './createbudget.component.css',
})
export class CreateBudgetComponent implements OnDestroy{
  subscription!:Subscription;
  private backendService=inject(BackendService);
  form = new FormGroup(
    {
      housing: new FormControl('', {
        validators: [Validators.required, Validators.min(0)],
      }),
      transport: new FormControl('', {
        validators: [Validators.required, Validators.min(0)],
      }),
      food: new FormControl('', {
        validators: [Validators.required, Validators.min(0)],
      }),
      clothing: new FormControl('', {
        validators: [Validators.required, Validators.min(0)],
      }),
      other: new FormControl('', {
        validators: [Validators.required, Validators.min(0)],
      }),
      startDate: new FormControl('', { validators: [Validators.required] }),
      endDate: new FormControl('', { validators: [Validators.required] }),
    },
    { validators: [isDatesValid] }
  );
  closeModal=output<void>();
  get isDatesInValid() {
    if (
      this.form.controls.housing.valid &&
      this.form.controls.transport.valid &&
      this.form.controls.clothing.valid &&
      this.form.controls.food.valid &&
      this.form.controls.other.valid &&
      this.form.invalid &&
      this.form.controls.startDate.dirty &&
      this.form.controls.startDate.touched &&
      this.form.controls.endDate.dirty
    ) {
      return true;
    }
    return false;
  }
  isModalOpen = true;

  openModal() {
    this.isModalOpen = true;
  }
  onSubmitBudgetForm(){
   
   this.subscription=this.backendService.post<{status:string}>(BudgetSetApi,this.budgetInfo()).
    subscribe({
      next:(val)=>{
        window.alert(`${val.status}`);
        this.closeModal.emit();
      },
      error:(error)=>{
        console.log(error,error.error.detail);
        window.alert(`${error.error.detail}`);
        this.closeModal.emit();
      }
        
    })
  }
  toCloseModal() {
    this.closeModal.emit();
    
  }
  budgetInfo(){
   return {
      housing: this.form.controls.housing.value,
      transport:this.form.controls.transport.value,
      food: this.form.controls.food.value,
      clothing: this.form.controls.clothing.value,
      other: this.form.controls.other.value,
      start_date: this.form.controls.startDate.value,
      end_date: this.form.controls.endDate.value,
  }
  }
  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}

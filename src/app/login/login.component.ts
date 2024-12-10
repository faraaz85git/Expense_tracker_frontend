import { HttpClient } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { BackendService } from '../backenedApi.service';
import { Router, RouterLink } from '@angular/router';

let savedCrential = JSON.parse(
  window.localStorage.getItem('login-info') || "{username:''}"
);

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  isValidCredential=signal(true);
  private subscription!: Subscription;
  private router = inject(Router);
  private backendService = inject(BackendService);
  private destroyRef = inject(DestroyRef);
  form = new FormGroup({
    userName: new FormControl(savedCrential.username, {
      validators: [Validators.required, Validators.minLength(1)],
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.minLength(1)],
    }),
  });

  ngOnInit() {
    const subscription = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe({
        next: (val) => {
          window.localStorage.setItem(
            'login-info',
            JSON.stringify({ username: val.userName })
          );
        },
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  get isInvalidUsername() {
    return (
      this.form.controls.userName.dirty && this.form.controls.userName.invalid
    );
  }
  get isInvalidPassword() {
    return (
      this.form.controls.password.dirty && this.form.controls.password.invalid
    );
  }
  onSubmit() {
    this.subscription = this.backendService
      .post<{ access_token: string; token_type: string }>(
        'http://127.0.0.1:8000/auth/login',
        {
          username: this.form.controls.userName.value,
          password: this.form.controls.password.value,
        }
      )
      .subscribe({
        next: (val) => {
          window.localStorage.setItem('Token', JSON.stringify(val));
          console.log(val.token_type);
        },
        error: (error) => {
          if(error.status===401){
            this.isValidCredential.set(false);
          }
          console.log(error);
        },
        complete: () => {
          this.router.navigate(['/home', 'dashboard']);
        },
      });
    console.log(this.form.value);
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  onInputData(){
    this.isValidCredential.set(true);
  }
}

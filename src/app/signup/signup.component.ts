import { Component, inject, OnDestroy, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BackendService } from '../backenedApi.service';
import { Subscription } from 'rxjs';
import { signupApi } from '../apis';
import { Router, RouterLink } from '@angular/router';

function isPasswordSame(control: AbstractControl) {
  let password = control.get('password');
  let confirmPassword = control.get('confirmPassword');
  if (password?.value === confirmPassword?.value) {
    return null;
  } else {
    return { isPasswordSame: false };
  }
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnDestroy {
  usernameExistError=signal(false)
  private router = inject(Router);
  private subcription!: Subscription;
  private backendService = inject(BackendService);
  form = new FormGroup(
    {
      username: new FormControl('', {
        validators: [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[0-9])[a-z0-9]+$'),
        ],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.pattern('^\\d{10,}$')],
      }),
      confirmPassword: new FormControl('', {
        validators: [Validators.required, Validators.pattern('^\\d{10,}$')],
      }),
    },
    { validators: [isPasswordSame] }
  );

  get isUsernameInValid() {
    return (
      this.form.controls.username.dirty && this.form.controls.username.invalid
    );
  }
  get isPasswordInValid() {
    return (
      this.form.controls.password.dirty && this.form.controls.password.invalid
    );
  }
  get isConfirmPasswordInValid() {
    return (
      this.form.controls.confirmPassword.dirty &&
      this.form.controls.confirmPassword.invalid
    );
  }
  get isPasswordSame() {
    return (
      this.form.controls.password.value ===
      this.form.controls.confirmPassword.value
    );
  }
  onSubmit() {
    this.subcription = this.backendService
      .post<{
        status: 'created';
      }>(signupApi, {
        user_name: this.form.controls.username.value,
        password: this.form.controls.password.value,
      })
      .subscribe({
        next: (val) => {
          window.alert('SignUp sucessfull. Redirect to login page.');
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 1000);
        },
        error: (error) => {
          console.log(error)
          this.usernameExistError.set(error.status===409);
        },
      });
    console.log(this.form.value);
    // this.router.navigate(['/home','login']);
  }
  onChangeUsername(){
    this.usernameExistError.set(false);
  }
  ngOnDestroy() {
    if(this.subcription){
       this.subcription.unsubscribe();
    }
  }
}

import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { loginApi, signupApi } from './app/apis';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

function AccessTokenInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  if (request.url === loginApi || request.url === signupApi) {
    return next(request);
  } else {
    var router=inject(Router);
    let Token = JSON.parse(window.localStorage.getItem('Token') || '');
    if (Token) {
      request=request.clone({
        setHeaders: {
          Authorization: `Bearer ${Token.access_token}`, // Set token in Authorization header
        },
      });
    }
    console.log(request);
    return next(request).pipe(catchError((error) => {
      if (error.status === 401) {
        window.alert("Session expired.Login again.");
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }));
  }
}

export const interceptors: [any] = [AccessTokenInterceptor];

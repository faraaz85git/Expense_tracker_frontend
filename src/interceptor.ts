import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { loginApi, signupApi } from './app/apis';

function AccessTokenInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  if (request.url === loginApi || request.url === signupApi) {
    return next(request);
  } else {
    let Token = JSON.parse(window.localStorage.getItem('Token') || '');
    if (Token) {
      request=request.clone({
        setHeaders: {
          Authorization: `Bearer ${Token.access_token}`, // Set token in Authorization header
        },
      });
    }
    console.log(request);
    return next(request);
  }
}

export const interceptors: [any] = [AccessTokenInterceptor];

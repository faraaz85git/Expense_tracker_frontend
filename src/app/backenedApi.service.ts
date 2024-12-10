import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private httpClient = inject(HttpClient);

  get<T>(url: string):Observable<T> {
    return this.httpClient.get<T>(url);
  }
  post<T>(url: string,body:any):Observable<T> {
    return this.httpClient.post<T>(url,body);
  }
  patch<T>(url: string,body:any):Observable<T> {
    return this.httpClient.patch<T>(url,body);
  }
  put<T>(url: string,body:any):Observable<T> {
    return this.httpClient.put<T>(url,body);
  }
  delete<T>(url: string):Observable<T> {
    return this.httpClient.delete<T>(url);
  }
}

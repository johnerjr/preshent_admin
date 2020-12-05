import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(data): Observable<any> {
    return this.http.post(`${environment.base_url}/admin/adminsignin`, data);
  }

  forgotPassword(email): Observable<any> {
    return this.http.post(`${environment.base_url}/admin/forgotPass`, email);
  }

}

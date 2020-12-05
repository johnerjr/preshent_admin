import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { JwtService } from './jwt.service';
@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient, private jwtService: JwtService) {}

    private setHeaders(headers: any = {}): HttpHeaders {
        headers['Accept'] = 'application/json';
        if (this.jwtService.getUserToken()) {
            headers['Authorization'] = `${this.jwtService.getUserToken()}`;
        }
        return new HttpHeaders(headers);
    }

    adminDetail(): Observable<any> {
        return this.http.get(`${environment.base_url}/users/adminDetail`, {
            headers: this.setHeaders({})
        });
    }

    updateProfileData(data): Observable<any> {
        return this.http.put(`${environment.base_url}/users/updateProfile`, data);
    }

    setForGotPassword(data): Observable<any> {
        return this.http.post(`${environment.base_url}/admin/postSetPassword`, data);
    }

    setPassword(data): Observable<any> {
        return this.http.post(`${environment.base_url}/admin/setPassword`, data);
    }

    changePassword(data): Observable<any> {
        return this.http.post(`${environment.base_url}/admin/changePassword`, data);
    }

    categoriesDetail(): Observable<any> {
        return this.http.post(`${environment.base_url}/categories/getCetegories`, {
            headers: this.setHeaders({})
        });
    }
}

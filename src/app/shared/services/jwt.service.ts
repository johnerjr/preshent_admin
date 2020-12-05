import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { Observable } from 'rxjs';
// import { BehaviorSubject } from 'rxjs';
// import jwtDecode from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class JwtService {
    constructor() {}

    private userData = new BehaviorSubject<any>({});
    public data = this.userData.asObservable();

    getUserData(): Observable<any> {
        return this.userData.asObservable();
    }

    sendUserData(data) {
        this.userData.next(data);
    }

    setCurrentUser(data){
        localStorage.setItem('currentUser', JSON.stringify(data));
    }

    getCurrentUser() {
        const currentUser =  localStorage.getItem('currentUser');
        // console.log(currentUser, " currentUser");
        return JSON.stringify(currentUser);
    }

    removeCurrentUser(){
        localStorage.removeItem('currentUser');
    }

    setUserToken(token: any) {
        localStorage.setItem('token', token);
    }
    getUserToken() {
        return localStorage.getItem('token');
    }
    removeToken() {
        localStorage.removeItem('token');
    }

    setIsLogin() {
        localStorage.setItem('isLoggedin', 'true');
    }
    resetIsLogin() {
        localStorage.removeItem('isLoggedin');
    }

    isLoggedOut() {
        this.removeToken();
        localStorage.removeItem('isLoggedin');
        this.removeCurrentUser();
    }
}

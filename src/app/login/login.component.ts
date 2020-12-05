import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { routerTransition } from '../router.animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService, JwtService } from '../shared/services';
import { constant } from '../../constants/constant';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
    submit: Boolean = false;
    constant: any = constant;
    isError: Boolean = false;
    errValue: String = '';
    display = false;
    loginForm: FormGroup;
    forgotForm: FormGroup;
    spinnerType = SPINNER.circle;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private jwtService: JwtService,
        private router: Router,
        private toastr: ToastrService,
        private ngxService: NgxUiLoaderService
    ) {
        this.loginForm = fb.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        '^([a-zA-Z0-9.]+)@([a-zA-Z]+).([a-zA-Z]{2,5})$'
                    )
                ]
            ],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.forgotForm = fb.group({
            email: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        '^([a-zA-Z0-9.]+)@([a-zA-Z]+).([a-zA-Z]{2,5})$'
                    )
                ]
            ]
        });
    }

    get f() {
        return this.loginForm.controls;
    }

    ngOnInit() {}

    onSubmit() {
        this.ngxService.start();
        this.submit = true;
        this.isError = false;
        this.errValue = '';
        if (!this.loginForm.valid) {
            this.ngxService.stop();
            return;
        } else {
            const userData = {
                email: this.loginForm.value.email,
                password: this.loginForm.value.password,
                role: constant.user.userType
            };
            this.authService.login(userData).subscribe(
                res => {
                    if (!res.success) {
                        this.isError = true;
                        this.toastr.error(
                            res.message,
                            'Sign-in',
                            constant.ToastConfig
                        );
                    } else {
                        this.toastr.success(
                            res.message,
                            'Sign-in',
                            constant.ToastConfig
                        );
                        this.jwtService.setUserToken(res.data.token);
                        this.jwtService.setIsLogin();
                        this.jwtService.sendUserData(res.data.user);
                        this.jwtService.setCurrentUser(res.data.user);
                        this.router.navigate(['/dashboard']);
                    }
                },
                err => {
                    this.toastr.error(
                        'Internal server error',
                        'Error!',
                        constant.ToastConfig
                    );
                }
            );
            this.ngxService.stop();
        }
    }

    forgotPassword() {
        this.display = true;
    }

    submitForgetPassword() {
        if (this.forgotForm.valid) {
            this.ngxService.start();
            const forgetVal = {
                email: this.forgotForm.value.email,
                role: constant.user.userType
            };

            this.authService.forgotPassword(forgetVal).subscribe(
                res => {
                    if (!res.success) {
                        this.toastr.info(
                            'Error!',
                            res.message,
                            constant.ToastConfig
                        );
                    } else {
                        this.display = false;
                        this.toastr.success(
                            'Success!',
                            res.message,
                            constant.ToastConfig
                        );
                        this.forgotForm.reset();
                    }
                    this.ngxService.stop();
                },
                err => {
                    this.toastr.error(
                        'Error!',
                        'Internal server error',
                        constant.ToastConfig
                    );
                    this.ngxService.stop();
                }
            );
        } else {
            this.ngxService.stop();
        }
    }
}

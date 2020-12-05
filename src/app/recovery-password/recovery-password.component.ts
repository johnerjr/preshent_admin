import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService, JwtService } from '../shared/services';
import { ToastrService } from 'ngx-toastr';
import { constant } from '../../constants/constant';

@Component({
    selector: 'app-recovery-password',
    templateUrl: './recovery-password.component.html',
    styleUrls: ['./recovery-password.component.css']
})
export class RecoveryPasswordComponent implements OnInit {
    product = {};
    showResetPasswordForm: any = false;
    forgotPassForm: FormGroup;
    submitted = false;
    userRoleEmail: any;

    constructor(
        private activeRoute: ActivatedRoute,
        private userService: UserService,
        private fb: FormBuilder,
        // private apiService: AuthService,
        // private jwtService: JwtService,
        private toastr: ToastrService,
        private router: Router
    ) {
        this.activeRoute.queryParams.subscribe(params => {
            this.product = {
                etl: params.etl,
                jpn: params.jpn
            };
        });

        this.confirmationPassword();
    }

    ngOnInit(): void {
        this.forgotPassForm = this.fb.group(
            {
                password: [
                    '',
                    Validators.compose([
                        Validators.required,
                        Validators.pattern(constant.regEx.passwordRegEx)
                    ])
                ],
                cpassword: ['', [Validators.required]]
            },
            { validator: this.passwordMatchValidator }
        );
    }

    passwordMatchValidator(formGroup: FormGroup) {
        return formGroup.get('password').value ===
            formGroup.get('cpassword').value
            ? null
            : { mismatch: true };
    }

    confirmationPassword() {
        this.userService.setPassword(this.product).subscribe(
            res => {
                if (!res.success) {
                    this.showResetPasswordForm = false;
                    this.toastr.error(
                        'Error!',
                        res['message'],
                        constant.ToastConfig
                    );
                } else {
                    this.showResetPasswordForm = true;
                    this.toastr.success(
                        'Success!',
                        res['message'],
                        constant.ToastConfig
                    );
                    this.userRoleEmail = res.data[0];
                }
            },
            err => {
                this.toastr.error(
                    'Error!',
                    'Internal server error',
                    constant.ToastConfig
                );
            }
        );
    }

    submitForgetPassword() {
        if (!this.forgotPassForm.valid) {
            this.submitted = true;
        } else {
            this.submitted = false;
            const passwordReset = {
                password: this.forgotPassForm.value.password,
                email: this.userRoleEmail.email,
                role: this.userRoleEmail.role
            };
            this.userService.setForGotPassword(passwordReset).subscribe(
                res => {
                    if (!res.success) {
                        this.toastr.info(
                            'Error!',
                            res.message,
                            constant.ToastConfig
                        );
                    } else {
                        this.toastr.success(
                            'Success!',
                            res.message,
                            constant.ToastConfig
                        );
                        this.router.navigateByUrl('login');
                    }
                },
                err => {
                    this.toastr.error(
                        'Error!',
                        'Internal server error',
                        constant.ToastConfig
                    );
                }
            );
        }
    }
}

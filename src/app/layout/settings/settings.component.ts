import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { constant } from '../../../constants/constant';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';
import { JwtService } from 'src/app/shared/services';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    key = '';
    forgotPassForm: FormGroup;
    pass = '';
    currentUser = {};

    submitted = false;
    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private userService: UserService,
        private toastr: ToastrService,
        private router: Router,
        private jwtService: JwtService
    ) {
        this.route.queryParams.subscribe(params => {
            this.key = params['key'];
            this.pass = params['pass'];
        });
        this.forgotPassForm = fb.group(
            {
                currentPassword: [
                    '',
                    Validators.compose([
                        Validators.required,
                        Validators.pattern(constant.regEx.passwordRegEx)
                    ])
                ],
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

    ngOnInit() {
        this.getUserData();
    }
    
    getUserData() {
        this.userService.adminDetail().subscribe(res => {
            if (res.success === true) {
                this.currentUser = res.data;
            }
        });
    }

    onSubmit() {
        if (!this.forgotPassForm.valid) {
            this.submitted = true;
        } else {
            this.submitted = false;
            const passwordReset = {
                currentPassword: this.forgotPassForm.value.currentPassword,
                newPassword: this.forgotPassForm.value.password,
                confirmNewPassword: this.forgotPassForm.value.cpassword,
                id: this.currentUser['id']
            };
            this.userService.changePassword(passwordReset).subscribe(
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
                        this.jwtService.isLoggedOut();
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

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { JwtService } from '../../shared/services/jwt.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { constant } from '../../../constants/constant';
import { ValidatorList } from '../../shared/services/validator.service';
// import { environment } from '../../../environments/environment';
import { UserService } from 'src/app/shared/services/user.service';
import { routerTransition } from 'src/app/router.animations';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    animations: [routerTransition()]
})
export class ProfileComponent implements OnInit {
    profileForm: FormGroup;
    disableEnableProfile = true;
    public account_validation_messages =
        ValidatorList.account_validation_messages;
    userData: any;
    constant: any = constant;

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private apiService: AuthService,
        private jwtService: JwtService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.profileForm = fb.group({
            firstName: [
                '',
                [
                    Validators.required,
                    Validators.pattern('^([a-zA-Z]*)$'),
                    Validators.minLength(3),
                    Validators.maxLength(16),
                    ValidatorList.avoidEmptyStrigs,
                    ValidatorList.nameValidator
                ]
            ],
            lastName: [
                '',
                [
                    Validators.required,
                    Validators.pattern('^([a-zA-Z]*)$'),
                    Validators.minLength(3),
                    Validators.maxLength(16),
                    ValidatorList.avoidEmptyStrigs,
                    ValidatorList.nameValidator
                ]
            ]
        });
    }

    /**
     * Function to validate formGroup on submit
     * @param formGroup
     */
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            control.markAsTouched({ onlySelf: true });
            control.markAsDirty({ onlySelf: true });
        });
    }

    ngOnInit() {
        this.getUserData();
    }
    getUserData() {
        this.userService.adminDetail().subscribe(res => {
            if (res.success === true) {
                this.userData = res.data;
                // this.profileForm.patchValue(res.data);
                this.profileForm.setValue({
                    firstName: this.userData.firstName,
                    lastName: this.userData.lastName
                });
                this.jwtService.sendUserData(res.data);
            }
        });
    }

    EditProfile() {
        this.disableEnableProfile = false;
    }

    disableUpdateButton() {
        this.disableEnableProfile = true;
        this.profileForm.reset();
        this.getUserData();
    }

    onProfileSubmit() {
        if (this.profileForm.invalid) {
            this.validateAllFormFields(this.profileForm);
            return;
        }

        const updateProfile = {
            firstName: this.profileForm.value.firstName,
            lastName: this.profileForm.value.lastName,
            email: this.userData.email,
            role: this.userData.role,
            id: this.userData.id
        };
        this.userService.updateProfileData(updateProfile).subscribe(
            res => {
                if (!res.success) {
                    this.toastr.error(
                        'Error!',
                        res['message'],
                        constant.ToastConfig
                    );
                } else {
                    this.disableEnableProfile = true;
                    this.getUserData();
                    this.toastr.success(
                        'Success!',
                        res['message'],
                        constant.ToastConfig
                    );
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

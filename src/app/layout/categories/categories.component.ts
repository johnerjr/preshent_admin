import { Component, OnInit } from '@angular/core';
import { JwtService, AuthService } from 'src/app/shared/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/shared/services/products.service';
import { ValidatorList } from 'src/app/shared/services/validator.service';
import { constant } from '../../../constants/constant';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
    categoriesForm: FormGroup;
    constant: any = constant;
    showMicroOption = false;
    allCategories = [];
    subCategoriesDetail = [];
    categoryStatus;
    editCategorybyId = '';
    editCategoryName = '';
    pagination = {
        page: 0,
        perPage: 10
    };
    public account_validation_messages =
        ValidatorList.account_validation_messages;
    checkboxValue: object = {};
    categories: any = [];
    categoriesList: any = [];
    subCategories: any = [];
    minorCategories: any = [];
    totalLength: any = '';
    catFilter = '';
    // spinnerType = SPINNER.circle;

    constructor(
        private productsService: ProductsService,
        private fb: FormBuilder,
        private apiService: AuthService,
        private jwtService: JwtService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private ngxService: NgxUiLoaderService
    ) {
        this.categoriesForm = fb.group({
            name: ['', [Validators.required]],
            categoriesID: ['', []],
            subCategoriesID: ['', []]
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

    ngOnInit(): void {
        this.ngxService.start();
        this.getCategoriesData(this.pagination);
        this.getAllCategoriesData();
        this.ngxService.stop();
    }

    paginate(event) {
        // event.first = Index of the first record
        // event.rows = Number of rows to display in new page
        // event.page = Index of the new page
        // event.pageCount = Total number of pages

        const getPaginate = {
            page: event.first,
            perPage: event.rows
        };
        this.getCategoriesData(getPaginate);
    }

    checkedEvent(id, event) {
        this.checkboxValue[id] = event.target.checked;
    }

    getCategoriesData(getPaginate) {
        this.ngxService.start();
        this.productsService.getCategoriesDetail(getPaginate).subscribe(res => {
            if (res.success === true) {
                this.categories = res.data;
                this.categoriesList = res.data;
                this.totalLength = res.totalCount;
            }
            this.ngxService.stop();
        });
    }

    getAllCategoriesData() {
        this.ngxService.start();
        this.productsService.getAllCategoriesData().subscribe(res => {
            if (res.success === true) {
                this.allCategories = res.data;
            }
            this.ngxService.stop();
        });
    }

    getSubCategories(categoriesID, i) {
        if (
            this.categories[i] &&
            this.categories[i]['subCategories'] &&
            this.categories[i]['subCategories'].length > 0
        ) {
            if (this.categories[i]) {
                this.categories[i]['subCategories'] = [];
            }
        } else {
            this.productsService
                .getSubCategoriesDetail(categoriesID)
                .subscribe(res => {
                    if (res.success === true) {
                        this.subCategories = res.data;
                        if (this.categories[i]) {
                            this.categories[i]['subCategories'] = res.data;
                        }
                    }
                });
        }
    }

    getMinorCategories(subCategoriesID, i, j) {
        if (
            this.categories[i]['subCategories'][j] &&
            this.categories[i]['subCategories'][j]['minorCategories'] &&
            this.categories[i]['subCategories'][j]['minorCategories'].length > 0
        ) {
            if (this.categories[i]['subCategories'][j]) {
                this.categories[i]['subCategories'][j]['minorCategories'] = [];
            }
        } else {
            this.productsService
                .getMinorCategoriesDetail(subCategoriesID)
                .subscribe(res => {
                    if (res.success === true) {
                        this.minorCategories = res.data;
                        if (this.categories[i]['subCategories'][j]) {
                            this.categories[i]['subCategories'][j][
                                'minorCategories'
                            ] = res.data;
                        }
                    }
                });
        }
    }

    getSelectSubCategories(categoriesID) {
        this.productsService
            .getSubCategoriesDetail(categoriesID)
            .subscribe(res => {
                if (res.success === true) {
                    this.subCategoriesDetail = res.data;
                }
            });
    }

    subCategoryOptionClicked() {
        this.showMicroOption = true;
        const categoriesID = this.categoriesForm.value.categoriesID;
        this.getSelectSubCategories(categoriesID);
    }

    onCategoriesSubmit() {
        this.ngxService.start();
        if (this.categoriesForm.invalid) {
            this.validateAllFormFields(this.categoriesForm);
            this.ngxService.stop();
            return;
        }
        if (this.categoriesForm.value.name) {
            const updateCategories = {
                name: this.categoriesForm.value.name,
                categoriesID: this.categoriesForm.value.categoriesID,
                subCategoriesID: this.categoriesForm.value.subCategoriesID
            };
            if (
                !updateCategories.categoriesID &&
                !updateCategories.subCategoriesID
            ) {
                const category = {
                    name: updateCategories.name
                };
                this.productsService
                    .saveCategoriesDetail(category)
                    .subscribe(res => {
                        if (!res.success) {
                            this.toastr.error(
                                'Error!',
                                res['message'],
                                constant.ToastConfig
                            );
                        } else {
                            this.categoriesForm.reset();
                            this.toastr.success(
                                'Success!',
                                res['message'],
                                constant.ToastConfig
                            );
                            this.getCategoriesData(this.pagination);
                        }
                    });
            }
            if (
                updateCategories.categoriesID &&
                !updateCategories.subCategoriesID
            ) {
                const subCategory = {
                    name: updateCategories.name,
                    categoriesID: updateCategories.categoriesID
                };
                this.productsService
                    .saveSubCategoriesDetail(subCategory)
                    .subscribe(res => {
                        if (!res.success) {
                            this.toastr.error(
                                'Error!',
                                res['message'],
                                constant.ToastConfig
                            );
                        } else {
                            this.categoriesForm.reset();
                            this.toastr.success(
                                'Success!',
                                res['message'],
                                constant.ToastConfig
                            );
                            this.getCategoriesData(this.pagination);
                        }
                    });
            }
            if (
                updateCategories.categoriesID &&
                updateCategories.subCategoriesID
            ) {
                const minorCategory = {
                    name: updateCategories.name,
                    subCategoriesID: updateCategories.subCategoriesID
                };

                this.productsService
                    .saveMinorCategoriesDetail(minorCategory)
                    .subscribe(res => {
                        if (!res.success) {
                            this.toastr.error(
                                'Error!',
                                res['message'],
                                constant.ToastConfig
                            );
                        } else {
                            this.categoriesForm.reset();
                            this.toastr.success(
                                'Success!',
                                res['message'],
                                constant.ToastConfig
                            );
                            this.getCategoriesData(this.pagination);
                        }
                    });
            }
            this.ngxService.stop();
        }
    }

    cancelEditCategories() {
        this.editCategorybyId = '';
        this.editCategoryName = '';
    }

    editCategories(category, i) {
        this.editCategoryName = category.name;
        this.editCategorybyId = category.id;
    }

    submitEditCategories(category) {
        this.ngxService.start();
        if (category.id && this.editCategoryName) {
            const newCategory = {
                name: this.editCategoryName,
                categoriesID: category.categoriesID,
                id: category.id
            };
            this.productsService
                .saveCategoriesDetail(newCategory)
                .subscribe(res => {
                    if (!res.success) {
                        this.toastr.error(
                            'Error!',
                            res['message'],
                            constant.ToastConfig
                        );
                    } else {
                        this.categoriesForm.reset();
                        this.editCategorybyId = '';
                        this.editCategoryName = '';
                        this.getCategoriesData(this.pagination);
                        this.toastr.success(
                            '',
                            res['message'],
                            constant.ToastConfig
                        );
                    }
                });
            this.ngxService.stop();
        } else {
            this.toastr.warning(
                '',
                'Please fill mandatory fields',
                constant.ToastConfig
            );
            this.ngxService.stop();
        }
    }

    submitCategoryStatus(event, category) {
        this.ngxService.start();
        if (category.id) {
            const newCatStatus = {
                id: category.id,
                name : category.name,
                status: category.status
            }
            this.productsService
                .saveCategoriesDetail(newCatStatus)
                .subscribe(res => {
                    if (!res.success) {
                        this.toastr.error(
                            'Error!',
                            res['message'],
                            constant.ToastConfig
                        );
                    } else {
                        this.categoriesForm.reset();
                        this.editCategorybyId = '';
                        this.editCategoryName = '';
                        this.subCategoriesDetail = [];
                        this.getAllCategoriesData();
                        this.getCategoriesData(this.pagination);
                        this.toastr.success(
                            '',
                            res['message'],
                            constant.ToastConfig
                        );
                    }
                });
            this.ngxService.stop();
        }
    }

    categoryFilterItem(keypress) {
        this.ngxService.start();
        if (keypress) {
            const filetrCategory = {
                name: keypress,
                page: this.pagination.page,
                perPage: this.pagination.perPage
            };
            this.productsService
                .categoryFiltersDetail(filetrCategory)
                .subscribe(res => {
                    if (!res.success) {
                        this.toastr.error(
                            'Error!',
                            res['message'],
                            constant.ToastConfig
                        );
                    } else {
                        this.categories = res.data;
                        this.totalLength = res.totalCount;
                    }
                });
                this.ngxService.stop();
        } else {
            this.getCategoriesData(this.pagination);
            this.ngxService.stop();
        }
    }
}

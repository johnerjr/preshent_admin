import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services';
import { Router } from '@angular/router';
import { FileHandle } from '../../directives/drag.directive';
import { ProductsService } from 'src/app/shared/services/products.service';
import { FlowBuilderService } from 'src/app/shared/services/flow-builder.service';
import { SPINNER, NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    // spinnerType = SPINNER.circle;
    pagination = {
        page: 0,
        perPage: 10
    };
    categoriesCount = 0;
    subCategoriesCount = 0;
    minorCategoriesCount = 0;
    totalCategoriesCount = 0;
    productsCount = 0;
    flowsCount = 0;

    constructor(
        private http: HttpClient,
        private toastr: ToastrService,
        private productsService: ProductsService,
        private flowBuilderService: FlowBuilderService,
        private router: Router,
        private ngxService: NgxUiLoaderService
    ) {}

    ngOnInit() {
        this.ngxService.start();
        this.getCategoriesCount();
        this.getProductData();
        this.getFlows();
    }

    getCategoriesCount() {
        this.productsService.getCategoriesCount().subscribe(res => {
            if (res.success === true) {
                const categories = res.data;
                if (categories) {
                    // this.categoriesCount = categories.totalCount;
                    // console.log(categories, ' categories');
                    this.totalCategoriesCount = categories.length;
                    // this.getSubCategoriesCount();
                }
            }
            this.ngxService.stop();
        });
    }

    // getSubCategoriesCount() {
    //     this.productsService.getSubCategoriesCount().subscribe(res => {
    //         if (res.success === true) {
    //             const categories = res.data;
    //             if (categories) {
    //                 this.subCategoriesCount = categories.totalCount;
    //                 this.getMinorCategoriesCount();
    //             }
    //         }
    //         this.ngxService.stop();
    //     });
    // }

    // getMinorCategoriesCount() {
    //     this.productsService.getMinorCategoriesCount().subscribe(res => {
    //         if (res.success === true) {
    //             const categories = res.data;
    //             if (categories) {
    //                 this.minorCategoriesCount = categories.totalCount;
    //                 this.totalCategoriesCount = this.categoriesCount + this.subCategoriesCount + this.minorCategoriesCount;
    //             }
    //         }
    //         this.ngxService.stop();
    //     });
    // }

    getProductData() {
        this.productsService.getProductData().subscribe(res => {
            if (res.success === true) {
                const categories = res.data;
                if (categories) {
                    this.productsCount = categories.totalCount;
                }
            }
            this.ngxService.stop();
        });
    }

    getFlows() {
        this.flowBuilderService.getFlowsCount().subscribe(res => {
            if (res.success === true) {
                const categories = res.data;
                if (categories) {
                    this.flowsCount = categories.totalCount;
                }
            }
            this.ngxService.stop();
        });
    }
}

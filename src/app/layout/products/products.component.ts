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
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
    // spinnerType = SPINNER.circle;
    prodFilter = '';
    constant: any = constant;

    pagination = {
        page: 0,
        perPage: 10
    };
    products = [];
    productLists = [];
    totalLength = '';
    prodCol = [];
    allProducts = [];
    productCats: any = [];

    constructor(
        private productsService: ProductsService,
        private fb: FormBuilder,
        private apiService: AuthService,
        private jwtService: JwtService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private ngxService: NgxUiLoaderService
    ) {}

    ngOnInit(): void {
        this.ngxService.start();
        this.getProductData(this.pagination);

        this.prodCol = [
            { field: 'name', header: 'Product Name' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'createdDate', header: 'Created' },
            { field: 'updatedDate', header: 'Updated' },
            { field: 'createdBy', header: 'created by' },
            { field: '', header: '' }
        ];
    }

    // categoryFilterItem(keypress) {
    //     // console.log(keypress, ' keypress categoryFilterItem');
    //     // if (keypress) {
    //     //     const filetrCategory = {
    //     //         name: keypress,
    //     //         page: this.pagination.page,
    //     //         perPage: this.pagination.perPage
    //     //     };
    //     //     this.productsService
    //     //         .categoryFiltersDetail(filetrCategory)
    //     //         .subscribe(res => {
    //     //             if (!res.success) {
    //     //                 this.toastr.error(
    //     //                     "Error!",
    //     //                     res["message"],
    //     //                     constant.ToastConfig
    //     //                 );
    //     //             } else {
    //     //                 this.categories = res.data;
    //     //                 this.totalLength = res.totalCount;
    //     //             }
    //     //         });
    //     // } else {
    //     //     this.getProductData(this.pagination);
    //     // }
    // }

    submitProductStatus(event, products) {
        this.ngxService.start();
        if (products.id) {
            const etitProduct = {
                product: {
                    id: products.id,
                    name: products.name,
                    description: products.description,
                    isActivated: products.isActivated
                }
            };
            this.productsService.updateProductStatus(etitProduct).subscribe(res => {
                if (!res.success) {
                    this.toastr.error(
                        'Error!',
                        res['message'],
                        constant.ToastConfig
                    );
                } else {
                    this.getProductData(this.pagination);
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

    getProductData(getPaginate) {
        this.ngxService.start();
        this.productsService.getProducts(getPaginate).subscribe(res => {
            if (res.success === true) {
                this.totalLength = res.totalCount;
                const productCats = [];
                this.allProducts = res.data;
                const allProducts = this.allProducts;

                const unique = allProducts
                    .map(e => e.id)
                    .map((e, i, final) => final.indexOf(e) === i && i)
                    .filter(e => allProducts[e])
                    .map(e => allProducts[e]);
                this.products = unique;
                unique.forEach(function(product) {
                    const filteredProduct = allProducts.filter(function(item) {
                        return item.id === product.id;
                    });

                    if (filteredProduct.length > 0) {
                        const category = [];
                        filteredProduct.forEach(function(item) {
                            let allCat = '';
                            allCat = item.c_name ? item.c_name : '';
                            if (item.sc_name) {
                                allCat = item.sc_name
                                    ? `${allCat}/${item.sc_name}`
                                    : '';
                            }
                            if (item.m_name) {
                                allCat = item.m_name
                                    ? `${allCat}/${item.m_name}`
                                    : '';
                            }
                            category.push({ category: allCat });
                        });
                        productCats.push({
                            id: product.id,
                            category: category
                        });
                    }
                });

                this.productCats = productCats;
                this.products.map((value, index) => {
                    this.productCats.map((val, ind) => {
                        if (value.id === val.id) {
                            value['category'] = val.category;
                        }
                    });
                });
            }
            this.ngxService.stop();
        });
    }

    editProduct(product) {
        // console.log(product, ' product *****8');
        this.router.navigate(['/products/add-products', product.id]);
    }
}

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { JwtService, AuthService } from 'src/app/shared/services';
import {
    FormBuilder,
    FormGroup,
    Validators,
    FormGroupName
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductsService } from 'src/app/shared/services/products.service';
import { ValidatorList } from 'src/app/shared/services/validator.service';
import { constant } from '../../../../constants/constant';
import { environment } from '../../../../environments/environment';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';

import * as $ from 'jquery';

// import { Key, element } from 'protractor';

const bucket = new S3({
    accessKeyId: environment.s3.accessKeyId,
    secretAccessKey: environment.s3.secretAccessKey,
    region: environment.s3.region
});

@Component({
    selector: 'app-add-products',
    templateUrl: './add-products.component.html',
    styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit {
    @ViewChild('fileInput') fileInput: any;
    // spinnerType = SPINNER.circle;
    productsForm: FormGroup;
    offerForm: FormGroup;
    productParameterForm: FormGroup;
    constant: any = constant;
    pagination = {
        page: 0,
        perPage: 10
    };
    public account_validation_messages =
        ValidatorList.account_validation_messages;

    // image:::
    imageChangedEvent: any = '';
    croppedImage: any = '';
    closeResult = '';

    submitted: boolean;
    percentage: number;
    postsData: any = [];

    buffer;
    file: any;
    product_image = '';
    s3Img = [];
    // cropedProdImg: File;
    fileType: any = '';
    offers: any;
    final_offer = [];

    // CATEGORIES //
    // categoriesForm: FormGroup;
    showMicroOption = false;
    subCategoriesDetail = [];
    categoryStatus;
    editCategorybyId = '';
    editCategoryName = '';

    checkboxValue: object = {};
    categories: any = [];
    categoriesList: any = [];
    subCategories: any = [];
    minorCategories: any = [];
    totalLength: any = '';
    catFilter = '';

    selectedCategories = false;

    categoryArray = [];
    curresntUser: string;

    // CATEGORIES //

    /* added by Nayan */
    preferredData = [];
    cats = [];
    subCats = [];
    minorCats = [];

    // productID = '';
    productID: number;
    private sub: any;
    products: any = [];

    allProducts = [];
    productCats: any = [];
    productImageKey: any = '';
    editCategory: any = [];

    /* eof added by Nayan */

    constructor(
        private productsService: ProductsService,
        private fb: FormBuilder,
        private apiService: AuthService,
        private jwtService: JwtService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private ngxService: NgxUiLoaderService
    ) {
        this.productsForm = fb.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.maxLength(110),
                    Validators.pattern(
                        /^(?!\s)[a-zA-Z0-9 .,/+=_()'"!@#$?%^&*\s-]*$/
                    )
                ]
            ],
            description: [
                '',
                [
                    Validators.required,
                    Validators.pattern(
                        /^(?!\s)[a-zA-Z0-9 .,/+=_()'"!@#$?%^&*\s-]*$/
                    )
                ]
            ],
            lumen: [''],
            watt: [''],
            kilowatt_hour: [''],
            gigahertz: [''],
            liter: [''],
            gallon: [''],
            volt: [''],
            ampere: [''],
            ampere_hour: [''],
            gallons_per_minute: [''],
            british_thermal_unit: [''],
            r_value: [''],
            width: [''],
            height: [''],
            depth: [''],
            catFilter: ['']
        });

        this.offerForm = fb.group({
            offer_url: ['', [Validators.required]],
            seller_name: ['', [Validators.required]],
            product_price: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.productID = +params['id']; // (+) converts string 'id' to a number
            if (this.productID) {
                this.getProductData(this.productID);
            } else {
                this.getCategoriesData();
                this.getSubCategoriesData();
                this.getMinorCategoriesData();
            }
        });

        // this.getOfferData();
        this.curresntUser = JSON.parse(localStorage.getItem('currentUser'));
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

    getSubCategoriesData() {
        this.productsService.getSubCategoriesDetail('').subscribe(res => {
            if (res.success === true) {
                this.subCats = res.data;
                let subCatStatus;
                if (this.editCategory.length > 0) {
                    this.subCats = res.data;
                    this.subCats.map((value, index) => {
                        subCatStatus = false;
                        this.editCategory.map((elm, ind) => {
                            if (
                                elm.subCategory === value.id &&
                                subCatStatus != true
                            ) {
                                subCatStatus = true;
                                const type = 'subCategory';
                                setTimeout(() => {
                                    this.checkboxClick(type, value.id);
                                }, 3000);
                                value['subCatCheck'] = true;
                            }
                        });
                    });
                    this.getMinorCategoriesData();
                } else {
                    this.subCats = res.data;
                }
            }
        });
    }

    getMinorCategoriesData() {
        this.productsService.getMinorCategoriesDetail('').subscribe(res => {
            if (res.success === true) {
                this.minorCats = res.data;
                let minorCatStatus;
                if (this.editCategory.length > 0) {
                    this.minorCats = res.data;
                    this.minorCats.map((value, index) => {
                        minorCatStatus = false;
                        this.editCategory.map((elm, ind) => {
                            const minorCat = parseInt(elm.minorCategory);
                            if (
                                minorCat === value.id &&
                                minorCatStatus != true
                            ) {
                                minorCatStatus = true;
                                const type = 'minorCategory';
                                setTimeout(() => {
                                    this.checkboxClick(type, value.id);
                                }, 5000);
                                value['minorCatCheck'] = true;
                            }
                        });
                    });
                } else {
                    this.minorCats = res.data;
                }
            }
        });
    }

    open(content) {
        this.modalService
            .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })
            .result.then(
                result => {
                    this.closeResult = `Closed with: ${result}`;
                },
                reason => {
                    this.closeResult = `Dismissed ${this.getDismissReason(
                        reason
                    )}`;
                }
            );
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    openOfferModel(offerModel) {
        this.modalService
            .open(offerModel, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg'
            })
            .result.then(
                result => {
                    this.closeResult = `Closed with: ${result}`;
                },
                reason => {
                    this.closeResult = `Dismissed ${this.getDismissReason(
                        reason
                    )}`;
                }
            );
    }

    fileChangeEvent(event: any, content): void {
        const valToLower = event.target.files[0].name.toLowerCase();
        const regex = new RegExp('(.*?).(jpg|png|jpeg)$'); //add or remove required extensions here
        const regexTest = regex.test(valToLower);
        if (regexTest === false) {
            this.toastr.warning('', 'Accept only image!', constant.ToastConfig);
            return;
        } else {
            this.imageChangedEvent = event;
            this.file = event.target.files[0];
            if (this.file.type) {
                const newFile = this.file.type.split('/');
                this.fileType = newFile[1];
            } else {
                this.fileType = 'png';
            }

            // console.log(this.s3Img, ' this.s3Img');
            this.open(content);
        }
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }

    cancelImage() {
        this.fileInput.nativeElement.value = '';
        // this.removeImage();
    }

    saveImage(data) {
        if (data !== '' && data !== undefined) {
            this.product_image = data;
            if (this.product_image && this.product_image !== undefined) {
                this.ngxService.start();
                const contentType = this.file.type;
                if (
                    contentType === 'image/jpeg' ||
                    contentType === 'image/png'
                ) {
                    const buf = new Buffer(
                        this.product_image.replace(
                            /^data:image\/\w+;base64,/,
                            ''
                        ),
                        'base64'
                    );
                    const params = {
                        Bucket: environment.s3.bucket,
                        Key: 'product-images' + '/' + this.file.name,
                        Body: buf,
                        ACL: 'public-read',
                        ContentType: contentType
                    };
                    // this.ngxService.start();
                    const that = this;
                    bucket
                        .upload(params)
                        .on('httpUploadProgress', function(evt) {
                            that.percentage = (evt.loaded * 100) / evt.total;
                        })
                        .send(function(err, data) {
                            if (err) {
                                that.toastr.error(
                                    'Add Images',
                                    'only images are allowed or check Internet disconnected',
                                    constant.ToastConfig
                                );
                                return false;
                            } else {
                                // postData['image'] = data.Location;
                                // postData['imageKey'] = data.Key;
                                const newImg = {
                                    image : data.Location,
                                    imageKey : data.Key
                                };
                                // console.log(newImg, ' newImg');
                                that.s3Img.push(newImg);
                                // console.log(that.s3Img, ' that.s3Img');

                                that.product_image = '';
                                that.imageChangedEvent = '';
                                that.file = '';
                                that.fileType = '';
                            }
                            that.ngxService.stop();
                            return true;
                        });
                } else {
                    this.toastr.error('only images are allowed', 'Add Images', {
                        timeOut: 5000
                    });
                    this.ngxService.stop();
                }

                this.modalService.dismissAll();
            }
        } else {
            this.product_image = '';
        }
    }

    removeImage(img, i) {
        if (img.imageKey) {
            this.ngxService.start();
            // if image fet from S3 //
            // this.product_image = this.products[0].image;
            // this.productImageKey = this.products[0].imageKey;
            const params = {
                Bucket: environment.s3.bucket,
                Key: img.imageKey
            };
            const that = this;
            bucket.deleteObject(params, function(err, data) {
                if (err) {
                    that.ngxService.stop();
                } else {
                    const index1 = that.s3Img.findIndex(
                        x =>
                            x.image === img.image &&
                            x.imageKey === img.imageKey
                    );
                    if (index1 >= 0) {
                        // this.offers.splice(index1, 1);
                        that.s3Img.splice(index1, 1);
                    }
                    that.ngxService.stop();
                }
            });
        }
    }

    removeAllImage(){
        if(!(this.productID) && this.s3Img.length>0) {
            this.s3Img.forEach(item =>{

                this.ngxService.start();
            // if image fet from S3 //
            // this.product_image = this.products[0].image;
            // this.productImageKey = this.products[0].imageKey;
            const params = {
                Bucket: environment.s3.bucket,
                Key: item.imageKey
            };
            const that = this;
            bucket.deleteObject(params, function(err, data) {
                if (err) {
                    that.ngxService.stop();
                } else {
                    const index1 = that.s3Img.findIndex(
                        x =>
                            x.image === item.image &&
                            x.imageKey === item.imageKey
                    );
                    if (index1 >= 0) {
                        // this.offers.splice(index1, 1);
                        that.s3Img.splice(index1, 1);
                    }
                    that.ngxService.stop();
                }
            });

            })
        }
    }

    cancelProductSubmit() {
        this.productsForm.reset();
        this.removeAllImage();
        this.offers = [];
        this.final_offer = [];
        this.offerForm.reset();

        this.preferredData = [];
        this.cats = [];
        this.subCats = [];
        this.minorCats = [];

        if (this.editCategory.length > 0) {
            this.getCategoriesData();
        } else {
            this.getCategoriesData();
            this.getSubCategoriesData();
            this.getMinorCategoriesData();
        }
    }

    // SUBMIT PRODUCTS //
    onProductsSubmit() {
        const category = [];
        /* added by Ganesh */
        this.ngxService.start();
        this.submitted = true;
        // console.log(this.productsForm.value, " this.productsForm")
        if (!this.productsForm.valid) {
            this.validateAllFormFields(this.productsForm);
            this.ngxService.stop();
        } else {
            this.submitted = false;
            this.preferredData.map((value, index) => {
                if (value.subCategory) {
                    if (value.minorCategory.length > 0) {
                        value.minorCategory.map((min, ind) => {
                            const newCat1 = {
                                category: value.category,
                                subcategory: value.subCategory,
                                minorCategory: min
                            };
                            category.push(newCat1);
                        });
                    } else {
                        const newCat1 = {
                            category: value.category,
                            subcategory: value.subCategory,
                            minorCategory: null
                        };
                        category.push(newCat1);
                    }
                } else {
                    const newCat3 = {
                        category: value.category,
                        subcategory: value.subCategory,
                        minorCategory: null
                    };
                    category.push(newCat3);
                }
            });

            const postData = {
                name: this.productsForm.value.name,
                description: this.productsForm.value.description,
                lumen: this.productsForm.value.lumen
                    ? this.productsForm.value.lumen
                    : '0',
                watt: this.productsForm.value.watt
                    ? this.productsForm.value.watt
                    : '0',
                kilowatt_hour: this.productsForm.value.kilowatt_hour
                    ? this.productsForm.value.kilowatt_hour
                    : '0',
                gigahertz: this.productsForm.value.gigahertz
                    ? this.productsForm.value.gigahertz
                    : '0',
                liter: this.productsForm.value.liter
                    ? this.productsForm.value.liter
                    : '0',
                gallon: this.productsForm.value.gallon
                    ? this.productsForm.value.gallon
                    : '0',
                volt: this.productsForm.value.volt
                    ? this.productsForm.value.volt
                    : '0',
                ampere: this.productsForm.value.ampere
                    ? this.productsForm.value.ampere
                    : '0',
                ampere_hour: this.productsForm.value.ampere_hour
                    ? this.productsForm.value.ampere_hour
                    : '0',
                gallons_per_minute: this.productsForm.value.gallons_per_minute
                    ? this.productsForm.value.gallons_per_minute
                    : '0',
                british_thermal_unit: this.productsForm.value
                    .british_thermal_unit
                    ? this.productsForm.value.british_thermal_unit
                    : '0',
                r_value: this.productsForm.value.r_value
                    ? this.productsForm.value.r_value
                    : '0',
                width: this.productsForm.value.width
                    ? this.productsForm.value.width
                    : '0',
                height: this.productsForm.value.height
                    ? this.productsForm.value.height
                    : '0',
                depth: this.productsForm.value.depth
                    ? this.productsForm.value.depth
                    : '0',
                createdBy: this.curresntUser['name']
            };
            let newPrice = 0;
            if (this.final_offer) {
                this.final_offer.map((element, ind, array) => {
                    // Return true or false
                    if (element.product_price) {
                        if (newPrice && newPrice > element.product_price) {
                            newPrice = element.product_price;
                        }
                    }
                });
                this.final_offer.map((element, ind, array) => {
                    // Return true or false
                    if (element.product_price) {
                        if (newPrice && newPrice > element.product_price) {
                            newPrice = element.product_price;
                        } else {
                            newPrice = element.product_price;
                        }
                    }
                });
            }

            postData['price'] = newPrice ? newPrice : 0;
            if (category.length < 0) {
                postData['isActivated'] = false;
            }
            if (this.productID) {
                postData['id'] = this.productID;
            }
            if (this.s3Img && this.s3Img.length > 0) {
                const newS3Img = JSON.stringify(this.s3Img);
                postData['image'] = newS3Img
                    ? newS3Img
                    : 'null';
            }
                // IF no images
                const finalCategoryDetail = {
                    product: postData,
                    category: JSON.stringify(category),
                    offer: JSON.stringify(this.final_offer)
                };

                this.productsService
                    .saveProducts(finalCategoryDetail)
                    .subscribe(res => {
                        if (!res.success) {
                            this.toastr.error(
                                'Error!',
                                res['message'],
                                constant.ToastConfig
                            );
                        } else {
                            this.productsForm.reset();
                            this.product_image = '';
                            this.categoryArray = [];

                            this.imageChangedEvent = '';
                            this.file = '';
                            this.fileType = '';
                            // this.cropedProdImg = new File([], '');
                            this.offers = [];
                            this.final_offer = [];
                            this.cats = [];
                            this.subCats = [];
                            this.minorCats = [];
                            this.s3Img = [];
                            if (this.productID) {
                                this.getProductData(this.productID);
                            } else {
                                this.getCategoriesData();
                                this.getSubCategoriesData();
                                this.getMinorCategoriesData();
                            }
                            // this.getCategoriesData();
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

     // Offer //

    cancelOffer() {
        this.modalService.dismissAll();
        this.offerForm.reset();
    }

    offerSubmit() {
        if (this.offerForm.invalid) {
            this.validateAllFormFields(this.offerForm);
            return;
        }
        if (this.offerForm.value.product_price) {
            this.modalService.dismissAll();
            const insertOffer = {
                offer_url: this.offerForm.value.offer_url,
                seller_name: this.offerForm.value.seller_name,
                product_price: this.offerForm.value.product_price
            };
            this.final_offer.push(insertOffer);
            if (this.final_offer.length > 0) {
                this.offerForm.reset();
                // this.getOfferData();
            }
        }
    }

    removeOffer(offer, i) {
        // this.offers.splice(this.offers[i], 1);
        const index1 = this.final_offer.findIndex(
            x =>
                x.offer_url === offer.offer_url &&
                x.seller_name === offer.seller_name
        );
        if (index1 >= 0) {
            // this.offers.splice(index1, 1);
            this.final_offer.splice(index1, 1);
        }
        // this.final_offer.splice(this.final_offer[i], 1);
    }

    /* SELECT MULTIPLE CATEGORY */
    checkboxClick(type, id) {
        if (type === 'category') {
            if ($(`#c${id}`).is(':checked')) {
                $(`.subcats${id}`).show();
                if (!this.preferredData.find(x => x.category === id)) {
                    this.preferredData.push({
                        category: id,
                        subCategory: null,
                        minorCategory: []
                    });
                }
            } else {
                $(`.subcats${id}`).hide();
                $(`.s${id}`).each(function() {
                    $(this).prop('checked', false);
                });
                $(`.mc${id}`).each(function() {
                    $(this).prop('checked', false);
                });
                this.preferredData = $.grep(
                    this.preferredData,
                    function(o, i) {
                        return o.category === id;
                    },
                    true
                );
            }
        } else if (type === 'subCategory') {
            const sData = this.subCats.find(x => x.id === id);
            const cData = this.cats.find(x => x.id === sData.categoriesID);
            if ($(`#s${id}`).is(':checked')) {
                $(`#c${cData.id}`).prop('checked', true);
                const index = this.preferredData.findIndex(
                    x => x.category === cData.id && x.subCategory === null
                );
                if (index >= 0) {
                    this.preferredData[index].subCategory = id;
                } else {
                    this.preferredData.push({
                        category: cData.id,
                        subCategory: id,
                        minorCategory: []
                    });
                }
            } else {
                $(`.m${id}`).each(function() {
                    $(this).prop('checked', false);
                });
                const index = this.preferredData.findIndex(
                    x => x.category === cData.id && x.subCategory === id
                );
                this.preferredData.splice(index, 1);
            }
        } else if (type === 'minorCategory') {
            const mData = this.minorCats.find(x => x.id === id);
            const sData = this.subCats.find(
                x => x.id === mData.subCategoriesID
            );
            const cData = this.cats.find(x => x.id === sData.categoriesID);
            if ($(`#m${id}`).is(':checked')) {
                $(`#c${cData.id}`).prop('checked', true);
                $(`#s${sData.id}`).prop('checked', true);
                const index1 = this.preferredData.findIndex(
                    x => x.category === cData.id && x.subCategory === sData.id
                );
                const index2 = this.preferredData.findIndex(
                    x => x.category === cData.id && x.subCategory === null
                );
                if (index1 >= 0) {
                    // if (this.preferredData[index1].mid.length > 0) {
                    //     this.preferredData[index1].mid.push(id);
                    // }
                    this.preferredData[index1].minorCategory.push(id);
                } else if (index2 >= 0) {
                    this.preferredData[index2].subCategory = sData.id;
                    this.preferredData[index2].minorCategory.push(id);
                } else {
                    this.preferredData.push({
                        category: cData.id,
                        subCategory: sData.id,
                        minorCategory: [id]
                    });
                }
            } else {
                const index = this.preferredData.findIndex(
                    x => x.category === cData.id && x.subCategory === sData.id
                );
                if (this.preferredData[index].minorCategory.length > 0) {
                    const index2 = this.preferredData[
                        index
                    ].minorCategory.findIndex(x => x === id);
                    this.preferredData[index].minorCategory.splice(index2, 1);
                }
            }
        }
    }
    /* SELECT MULTIPLE CATEGORY */

    getCategoriesData() {
        let catStatus;
        this.productsService.getAllCategoriesData().subscribe(res => {
            if (res.success === true) {
                this.cats = res.data;
                if (this.editCategory.length > 0) {
                    this.cats = res.data;
                    this.cats.map((value, index) => {
                        catStatus = false;
                        this.editCategory.map((elm, ind) => {
                            if (
                                elm.category === value.id &&
                                catStatus != true
                            ) {
                                const type = 'category';
                                setTimeout(() => {
                                    this.checkboxClick(type, value.id);
                                }, 2000);
                                catStatus = true;
                                value['catCheck'] = true;
                            }
                        });
                    });

                    this.getSubCategoriesData();
                } else {
                    this.cats = res.data;
                }
                this.totalLength = res.totalCount;
            }
        });
    }

    // EDIT CASE FOR PRODUCT //
    getProductData(productID) {
        this.productsService.getProductsById(productID).subscribe(res => {
            if (res.success === true) {
                this.totalLength = res.totalCount;
                this.products = res.data.product;
                this.offers = res.data.offer;
                this.offers.map((value, index) => {
                    const insertOffer = {
                        offer_url: value.offer_url,
                        seller_name: value.seller_name,
                        product_price: value.product_price
                    };
                    this.final_offer.push(insertOffer);
                });
                // GET CATEGORY DETAIL //
                this.editCategory = res.data.category;
                if (this.editCategory.length > 0) {
                    this.getCategoriesData();
                } else {
                    this.getCategoriesData();
                    this.getSubCategoriesData();
                    this.getMinorCategoriesData();
                }

                if (this.products) {
                    this.productsForm.patchValue({
                        name: this.products[0].name,
                        description: this.products[0].description,
                        lumen: this.products[0].lumen,
                        watt: this.products[0].watt,
                        kilowatt_hour: this.products[0].kilowatt_hour,
                        gigahertz: this.products[0].gigahertz,
                        liter: this.products[0].liter,
                        gallon: this.products[0].gallon,
                        volt: this.products[0].volt,
                        ampere: this.products[0].ampere,
                        ampere_hour: this.products[0].ampere_hour,
                        gallons_per_minute: this.products[0].gallons_per_minute,
                        british_thermal_unit: this.products[0]
                            .british_thermal_unit,
                        r_value: this.products[0].r_value,
                        width: this.products[0].width,
                        height: this.products[0].height,
                        depth: this.products[0].depth
                    });

                    this.s3Img = JSON.parse(this.products[0].image);
                    this.productImageKey = this.products[0].imageKey;
                }
            }
        });
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
        this.getCategoriesData();
    }

    categoryFilterItem(keypress) {
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
                        this.cats = res.data;
                        this.categories = res.data;
                        this.totalLength = res.totalCount;
                    }
                });
        } else {
            this.getCategoriesData();
        }
    }

    submitCategoryStatus(event, category) {
        if (category.id) {
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
                        // this.categoriesForm.reset();
                        this.editCategorybyId = '';
                        this.editCategoryName = '';
                        this.getCategoriesData();
                        this.toastr.success(
                            '',
                            res['message'],
                            constant.ToastConfig
                        );
                    }
                });
        }
    }

    // CATEGORIES //
}

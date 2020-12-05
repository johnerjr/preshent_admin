import { Component, OnInit, Input } from '@angular/core';
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
import { constant } from '../../../constants/constant';
import { environment } from '../../../environments/environment';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { NgxUiLoaderService, SPINNER } from 'ngx-ui-loader';
import { FlowBuilderService } from 'src/app/shared/services/flow-builder.service';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem
} from '@angular/cdk/drag-drop';

import * as $ from 'jquery';

const bucket = new S3({
    accessKeyId: environment.s3.accessKeyId,
    secretAccessKey: environment.s3.secretAccessKey,
    region: environment.s3.region
});

@Component({
    selector: 'app-form-builder',
    templateUrl: './form-builder.component.html',
    styleUrls: ['./form-builder.component.css']
})
export class FormBuilderComponent implements OnInit {
    // spinnerType = SPINNER.circle;
    flowForm: FormGroup;
    public account_validation_messages =
        ValidatorList.account_validation_messages;
    constant: any = constant;
    closeResult: string;

    // FOR Images
    product_image: any;
    imageChangedEvent: any;
    file: any;
    fileType: any;
    croppedImage: string;
    cropedProdImg: File;
    showImage: string;
    imageSrc: string;
    questions: any = [];
    selectQue = {};
    selectedQuestion = [];
    percentage: number;
    flows: any = [];
    selectedFlowID = '';
    flow_questions: any = [];
    selectedQuestionID = '';
    answers: any[];
    selectedAnswerID = '';
    selected_flow = '';
    selected_flow_Question = '';
    selected_flow_Question_answers = [];

    // ALL Products
    preferredData = [];
    cats = [];
    subCats = [];
    minorCats = [];
    pagination = {
        page: 0,
        perPage: 10
    };
    totalLength: any;
    catFilter = '';
    selectedQuestionProduct: any;
    editflows = [];
    flowCategories: any = [];
    editCategory: any = [];
    editFlowQueAns: any = [];
    editableFlows: any = [];
    imageKey: any = '';
    editFlowStatus = false;

    constructor(
        private productsService: ProductsService,
        private flowBuilderService: FlowBuilderService,
        private fb: FormBuilder,
        private apiService: AuthService,
        private jwtService: JwtService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private modalService: NgbModal,
        private ngxService: NgxUiLoaderService
    ) {
        this.flowForm = fb.group({
            flow_name: ['', [Validators.required]],
            flow_question: ['']
        });
    }

    ngOnInit(): void {
        this.ngxService.start();

        this.getAllQuestion();
        this.getFlowData();
        this.getSubCategoriesData();
        this.getMinorCategoriesData();
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

    openOfferModel(offerModel) {
        this.selectedFlowID = '';
        this.selectedQuestionID = '';
        this.selectedAnswerID = '';
        this.flow_questions = [];
        this.answers = [];
        this.flowForm.reset();
        this.selectedQuestion = [];
        this.imageSrc = '';
        this.editflows = [];

        // OPEN ADD FLOW MODEL //
        this.editFlowStatus = false;
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
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    getFlowData() {
        this.ngxService.start();
        this.flowBuilderService.getFlows().subscribe(res => {
            if (res.success === true) {
                this.flows = res.data;
                this.editableFlows = res.data;
            }
            this.ngxService.stop();
        });
    }

    getAllQuestion() {
        this.ngxService.start();
        this.productsService.getQuestionDetail().subscribe(res => {
            if (!res.success) {
                this.toastr.error(
                    'Error!',
                    res['message'],
                    constant.ToastConfig
                );
            } else {
                this.questions = res.data;
            }
            this.ngxService.stop();
        });
    }

    setQuestion(type, event) {
        const que = this.selectQue;
    }

    selectQuestion() {
        const newQuestion = this.selectQue;
        const flow_name = this.flowForm.value.flow_name;
        this.flowForm.reset({ flow_question: '' });
        this.flowForm.setValue({
            flow_name: flow_name,
            flow_question: flow_name
        });
        const findcatIndex = this.selectedQuestion.findIndex(
            x => x.id === newQuestion['id']
        );
        if (findcatIndex >= 0) {
            this.toastr.warning(
                '',
                'Question already selected!',
                constant.ToastConfig
            );
            this.selectQue = {};
        } else {
            if (newQuestion['id']) {
                this.selectedQuestion.push(newQuestion);
                this.selectQue = {};
            } else {
                this.selectQue = {};
            }
        }
    }

    // START  Flow Image //

    removeImage(editflowsID) {
        if (editflowsID.id) {
            if (this.imageKey) {
                const params = {
                    Bucket: environment.s3.bucket,
                    Key: this.imageKey
                };
                let that = this;
                bucket.deleteObject(params, function(err, data) {
                    if (err) {
                    } else {
                        that.imageChangedEvent = '';
                        that.file = '';
                        that.fileType = '';
                        const reader = new FileReader();
                        that.imageSrc = '';
                        that.imageKey = '';
                    }
                });
            } else {
                this.imageChangedEvent = '';
                this.file = '';
                this.fileType = '';
                const reader = new FileReader();
                this.imageSrc = '';
            }
        } else {
            this.imageChangedEvent = '';
            this.file = '';
            this.fileType = '';
            const reader = new FileReader();
            this.imageSrc = '';
        }
    }

    fileChangeEvent(event: any): void {
        const reader = new FileReader();
        this.imageChangedEvent = event;

        const imageSize = event.target.files[0].size;
        this.file = event.target.files[0];
        reader.readAsDataURL(this.file);
        reader.onload = () => {
            this.imageSrc = reader.result as string;
        };
        if (this.file.type) {
            const newFile = this.file.type.split('/');
            this.fileType = newFile[1];
        } else {
            this.fileType = 'png';
        }
    }

    // END  Flow Image //

    cancelFlow() {
        this.modalService.dismissAll();
        this.flowForm.reset();
        this.selectedQuestion = [];
        this.selectQuestion();
        this.imageSrc = '';
    }

    flowSubmit(editflows) {
        // FOR WHEN EDIT case //
        if (editflows.id) {
            this.ngxService.start();

            if (this.flowForm.value.flow_name) {
                const question_array = [];
                if (this.selectedQuestion) {
                    this.selectedQuestion.map((value, index) => {
                        question_array.push(value.id);
                    });
                }
                const flow_data = {
                    flow_name: this.flowForm.value.flow_name,
                    flow_questions: JSON.stringify(question_array),
                    id: editflows.id
                };
                this.modalService.dismissAll();
                if (
                    this.file &&
                    this.file !== undefined &&
                    (this.imageKey === 'null' || !this.imageKey)
                ) {
                    const contentType = this.file.type;
                    if (
                        contentType === 'image/jpeg' ||
                        contentType === 'image/png'
                    ) {
                        const params = {
                            Bucket: environment.s3.bucket,
                            Key: 'flow-images' + '/' + this.file.name,
                            Body: this.file,
                            ACL: 'public-read',
                            ContentType: contentType
                        };

                        const that = this;
                        bucket
                            .upload(params)
                            .on('httpUploadProgress', function(evt) {
                                that.percentage =
                                    (evt.loaded * 100) / evt.total;
                            })
                            .send(function(err, data) {
                                if (err) {
                                    this.toastr.error(
                                        'only images are allowed',
                                        'Add Images',
                                        { timeOut: 5000 }
                                    );
                                    return false;
                                } else {
                                    flow_data['image'] = data.Location;
                                    flow_data['imageKey'] = data.Key;

                                    that.flowBuilderService
                                        .saveFlow(flow_data)
                                        .subscribe(res => {
                                            if (!res.success) {
                                                that.toastr.error(
                                                    'Error!',
                                                    res['message'],
                                                    constant.ToastConfig
                                                );
                                            } else {
                                                that.flowForm.reset();
                                                that.product_image = '';
                                                that.imageChangedEvent = '';
                                                that.file = '';
                                                that.fileType = '';
                                                that.imageSrc = '';
                                                that.selectedQuestion = [];
                                                that.modalService.dismissAll();
                                                that.getFlowData();

                                                that.toastr.success(
                                                    '',
                                                    res['message'],
                                                    constant.ToastConfig
                                                );
                                            }
                                        });
                                }
                                return true;
                            });
                    } else {
                        this.toastr.error(
                            'only images are allowed',
                            'Add Images',
                            {
                                timeOut: 5000
                            }
                        );
                    }
                    this.ngxService.stop();
                } else {
                    // IF no images
                    flow_data['image'] = this.imageSrc ? this.imageSrc : 'null';
                    flow_data['imageKey'] = this.imageKey
                        ? this.imageKey
                        : 'null';
                    this.flowBuilderService
                        .saveFlow(flow_data)
                        .subscribe(res => {
                            if (!res.success) {
                                this.toastr.error(
                                    'Error!',
                                    res['message'],
                                    constant.ToastConfig
                                );
                            } else {
                                this.flowForm.reset();
                                this.product_image = '';
                                this.imageChangedEvent = '';
                                this.file = '';
                                this.fileType = '';
                                this.imageSrc = '';
                                this.selectedQuestion = [];
                                this.modalService.dismissAll();
                                this.getFlowData();

                                this.toastr.success(
                                    '',
                                    res['message'],
                                    constant.ToastConfig
                                );
                            }
                        });
                    this.ngxService.stop();
                }
            } else {
                this.toastr.warning(
                    '',
                    'Please fill all valid fields',
                    constant.ToastConfig
                );
                this.ngxService.stop();
            }
            // FOER WHEN NOT EDIT //
        } else {
            // FOR Else case WHEN EDIT not by Id //
            this.ngxService.start();
            if (this.flowForm.value.flow_name) {
                const question_array = [];
                if (this.selectedQuestion) {
                    this.selectedQuestion.map((value, index) => {
                        question_array.push(value.id);
                    });
                }
                const flow_data = {
                    flow_name: this.flowForm.value.flow_name,
                    flow_questions: JSON.stringify(question_array)
                };
                this.modalService.dismissAll();
                if (this.file && this.file !== undefined) {
                    const contentType = this.file.type;
                    if (
                        contentType === 'image/jpeg' ||
                        contentType === 'image/png'
                    ) {
                        const params = {
                            Bucket: environment.s3.bucket,
                            Key: 'flow-images' + '/' + this.file.name,
                            Body: this.file,
                            ACL: 'public-read',
                            ContentType: contentType
                        };

                        const that = this;
                        bucket
                            .upload(params)
                            .on('httpUploadProgress', function(evt) {
                                that.percentage =
                                    (evt.loaded * 100) / evt.total;
                            })
                            .send(function(err, data) {
                                if (err) {
                                    this.toastr.error(
                                        'only images are allowed',
                                        'Add Images',
                                        { timeOut: 5000 }
                                    );
                                    return false;
                                } else {
                                    flow_data['image'] = data.Location;
                                    flow_data['imageKey'] = data.Key;

                                    that.flowBuilderService
                                        .saveFlow(flow_data)
                                        .subscribe(res => {
                                            if (!res.success) {
                                                that.toastr.error(
                                                    'Error!',
                                                    res['message'],
                                                    constant.ToastConfig
                                                );
                                            } else {
                                                that.flowForm.reset();
                                                that.product_image = '';
                                                that.imageChangedEvent = '';
                                                that.file = '';
                                                that.fileType = '';
                                                that.imageSrc = '';
                                                that.selectedQuestion = [];
                                                that.modalService.dismissAll();
                                                that.getFlowData();

                                                that.toastr.success(
                                                    '',
                                                    res['message'],
                                                    constant.ToastConfig
                                                );
                                            }
                                        });
                                }
                                return true;
                            });
                    } else {
                        this.toastr.error(
                            'only images are allowed',
                            'Add Images',
                            {
                                timeOut: 5000
                            }
                        );
                    }
                    this.ngxService.stop();
                } else {
                    // IF no images
                    flow_data['image'] = 'null';
                    flow_data['imageKey'] = 'null';
                    this.flowBuilderService
                        .saveFlow(flow_data)
                        .subscribe(res => {
                            if (!res.success) {
                                this.toastr.error(
                                    'Error!',
                                    res['message'],
                                    constant.ToastConfig
                                );
                            } else {
                                this.flowForm.reset();
                                this.product_image = '';
                                this.imageChangedEvent = '';
                                this.file = '';
                                this.fileType = '';
                                this.imageSrc = '';
                                this.selectedQuestion = [];
                                this.modalService.dismissAll();
                                this.getFlowData();

                                this.toastr.success(
                                    '',
                                    res['message'],
                                    constant.ToastConfig
                                );
                            }
                        });
                    this.ngxService.stop();
                }
            } else {
                this.toastr.warning(
                    '',
                    'Please fill all valid fields',
                    constant.ToastConfig
                );
                this.ngxService.stop();
            }
        }
    }

    // SELECTED FLOW //
    getClickFlow(flow, i) {
        if (this.selectedFlowID && this.selectedFlowID === flow.id) {
            this.selectedFlowID = '';
            this.selectedQuestionID = '';
            this.selectedAnswerID = '';
            this.flow_questions = [];
            this.answers = [];
        } else {
            this.flow_questions = [];
            this.answers = [];
            this.selectedAnswerID = '';
            this.selectedQuestionID = '';
            this.selectedFlowID = flow.id;
            this.getSelectedFlowQuestion(flow.flow_questions);
        }
    }

    getSelectedFlowQuestion(flow) {
        const FlowQues = {
            qusetion_ids: flow
        };
        this.flowBuilderService.getFlowQuestions(FlowQues).subscribe(res => {
            if (res.success === true) {
                this.flow_questions = res.data;
            }
        });
    }
    // SELECTED FLOW //

    // SELECTED QUESTIONS //
    getClickQuestions(question_id) {
        this.selectedQuestionProduct = '';
        this.cats = [];
        if (
            this.selectedQuestionID &&
            this.selectedQuestionID === question_id
        ) {
            this.selectedQuestionID = '';
            this.selectedAnswerID = '';
            this.answers = [];
        } else {
            this.answers = [];
            this.selectedAnswerID = '';
            this.selectedQuestionID = question_id;
            this.getSelectedQuestionAnswer(question_id);
        }
    }

    getProductClickQuestions(question_id) {
        this.questions = [];
        this.answers = [];
        this.selectedAnswerID = '';
        this.selectedQuestionID = '';
        this.getCategoriesData();
        this.selectedQuestionProduct = question_id;
    }

    getSelectedQuestionAnswer(question_id) {
        this.productsService
            .getSelectedQuestionAnswer(question_id)
            .subscribe(res => {
                if (!res.success) {
                    this.toastr.error(
                        'Error!',
                        res['message'],
                        constant.ToastConfig
                    );
                } else {
                    this.answers = res.data;
                }
            });
    }

    selectedFlow(flowId) {
        this.selected_flow_Question_answers = [];
        this.selected_flow_Question = '';
        this.selected_flow = flowId;
        this.selectedQuestionProduct = '';
        this.cats = [];
    }

    selectedFlowQuestion(flowQuestionId) {
        this.selected_flow_Question_answers = [];
        this.selected_flow_Question = flowQuestionId;
        this.getSelectedQuestionAnswerByID(flowQuestionId);
    }

    onAnswerCheckboxSelect(answerID, i) {
        const findAnsIndex = this.selected_flow_Question_answers.findIndex(
            x => x === answerID
        );
        if (findAnsIndex >= 0) {
            this.selected_flow_Question_answers.splice(findAnsIndex, 1);
        } else {
            this.selected_flow_Question_answers.push(answerID);
        }
    }

    cancelFlowBuilder() {
        // this.selected_flow = '';
        this.selected_flow_Question = '';
        this.selected_flow_Question_answers = [];
        this.editflows = [];

        this.selectedQuestionID = '';
        this.selectedQuestionProduct = '';
        this.cats = [];
        this.answers = [];
    }

    saveFlowBuilder() {
        this.ngxService.start();
        if (this.selected_flow) {
            if (this.selected_flow_Question) {
                const flowBuilderDetail = {
                    flow_id: this.selected_flow,
                    flow_questions: this.selected_flow_Question,
                    flow_Question_answers: JSON.stringify(
                        this.selected_flow_Question_answers
                    ),
                    type: 'flowQuestion'
                };
                if (this.editFlowQueAns !== undefined) {
                    flowBuilderDetail['id'] = this.editFlowQueAns.id;
                }
                this.flowBuilderService
                    .saveFlowBuilder(flowBuilderDetail)
                    .subscribe(res => {
                        if (!res.success) {
                            this.toastr.error(
                                'Error!',
                                res['message'],
                                constant.ToastConfig
                            );
                        } else {
                            this.selected_flow = '';
                            this.selected_flow_Question = '';
                            this.selected_flow_Question_answers = [];
                            this.selectedFlowID = '';
                            this.selectedQuestionID = '';
                            this.selectedAnswerID = '';
                            this.flow_questions = [];
                            this.answers = [];

                            this.cats = [];
                            this.subCats = [];
                            this.minorCats = [];
                            this.preferredData = [];
                            this.toastr.success(
                                '',
                                res['message'],
                                constant.ToastConfig
                            );
                        }
                    });
                this.ngxService.stop();
            } else {
                const category = [];
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

                const flowBuilderDetail = {
                    flow_id: this.selected_flow,
                    category: JSON.stringify(category),
                    type: 'flowCategory'
                };
                this.flowBuilderService
                    .saveFlowBuilder(flowBuilderDetail)
                    .subscribe(res => {
                        if (!res.success) {
                            this.toastr.error(
                                'Error!',
                                res['message'],
                                constant.ToastConfig
                            );
                        } else {
                            this.selected_flow = '';
                            this.selected_flow_Question = '';
                            this.selected_flow_Question_answers = [];
                            this.selectedFlowID = '';
                            this.selectedQuestionID = '';
                            this.selectedAnswerID = '';
                            this.flow_questions = [];
                            this.answers = [];
                            this.cats = [];
                            this.subCats = [];
                            this.minorCats = [];
                            this.preferredData = [];
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
        } else {
            this.toastr.success(
                '',
                'please select valid flow',
                constant.ToastConfig
            );
            this.ngxService.stop();
        }
    }

    // ALL Categories //
    // getCategoriesData(getPaginate) {
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
                                }, 1500);
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

    getSubCategoriesData() {
        this.ngxService.start();
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
                                }, 600);
                                value['subCatCheck'] = true;
                            }
                        });
                    });
                    this.getMinorCategoriesData();
                } else {
                    this.subCats = res.data;
                }
            }
            this.ngxService.stop();
        });
    }

    getMinorCategoriesData() {
        this.ngxService.start();
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
                                }, 4000);
                                value['minorCatCheck'] = true;
                            }
                        });
                    });
                } else {
                    this.minorCats = res.data;
                }
            }
            this.ngxService.stop();
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
                        // this.categories = res.data;
                        this.totalLength = res.totalCount;
                    }
                });
        } else {
            this.getCategoriesData();
        }
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

    // EDIT FLOW //
    editFlow(flow, offerModel) {
        this.flowBuilderService.editFlows(flow.id).subscribe(res => {
            if (res.success === true) {
                this.editflows = res.data[0];
                const FlowQues = {
                    qusetion_ids: this.editflows['flow_questions']
                };
                this.flowBuilderService
                    .getFlowQuestions(FlowQues)
                    .subscribe(res => {
                        if (res.success === true) {
                            const newSlectQUE = res.data;
                            const newQueIDS = JSON.parse(
                                this.editflows['flow_questions']
                            );
                            newQueIDS.map((value, index) => {
                                newSlectQUE.map((val, indx) => {
                                    if (value === val.id) {
                                        this.selectedQuestion.push(val);
                                    }
                                });
                            });
                            // this.selectedQuestion = res.data;
                        }
                    });
                const flowName = this.editflows['flow_name'];
                const que = this.editflows['flow_name'];
                this.flowForm.patchValue({
                    flow_name: flowName,
                    flow_question: flowName
                });
                this.imageSrc = this.editflows['image'];
                this.imageKey = this.editflows['imageKey'];

                // OPEN MODEL
                this.editFlowStatus = true;
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
                // OPEN MODEL
            }
        });
    }

    getFlowCategory() {
        const flow_id = this.selected_flow;
        this.cats = [];
        this.flowBuilderService.getFlowsCategoryByID(flow_id).subscribe(res => {
            if (res.success === true) {
                this.editCategory = res.data;
                if (this.editCategory.length > 0) {
                    this.getCategoriesData();
                } else {
                    this.getCategoriesData();
                    this.getSubCategoriesData();
                    this.getMinorCategoriesData();
                }
            }
        });
    }

    getSelectedQuestionAnswerByID(flowQuestionId) {
        let ansStatus;
        this.editFlowQueAns = '';
        const flowQueID = {
            flow_id: this.selected_flow,
            que_id: flowQuestionId
        };
        this.flowBuilderService
            .getSelectedQueAnsByID(flowQueID)
            .subscribe(res => {
                if (res.success === true) {
                    this.editFlowQueAns = res.data[0];
                    if (
                        this.editFlowQueAns &&
                        this.editFlowQueAns['flow_Question_answers']
                    ) {
                        const editFQAns = JSON.parse(
                            this.editFlowQueAns['flow_Question_answers']
                        );
                        this.selected_flow_Question_answers = editFQAns;
                        this.answers.map((value, index) => {
                            ansStatus = false;
                            editFQAns.map((elm, ind) => {
                                if (elm === value.id && ansStatus !== true) {
                                    ansStatus = true;
                                    value['ansCheck'] = true;
                                }
                            });
                        });
                    }
                }
            });
    }

    // FLOW DRAG AND DROP //
    drop(event: CdkDragDrop<string[]>) {
        let newCurrentIndexPlus;
        let totalFlowLength;
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
        totalFlowLength = this.flows.length;
        newCurrentIndexPlus = event.currentIndex + 1;
        if (event.currentIndex + 1 < totalFlowLength) {
            newCurrentIndexPlus = event.currentIndex + 1;
        } else {
            newCurrentIndexPlus = event.currentIndex - 1;
        }
        const updateFlow = {
            oldFlow: {
                id: this.editableFlows[newCurrentIndexPlus].id,
                position: this.editableFlows[event.currentIndex].position
            },
            currentFlow: {
                id: this.editableFlows[event.currentIndex].id,
                position: this.editableFlows[newCurrentIndexPlus].position
            }
        };
        this.flowBuilderService
            .updateDragFlowsDetail(updateFlow)
            .subscribe(res => {
                if (!res.success) {
                    this.toastr.error(
                        'Error!',
                        res['message'],
                        constant.ToastConfig
                    );
                } else {
                    this.getFlowData();
                }
                this.ngxService.stop();
            });
    }

    // Question DRAG AND DROP //
    dropQuestion(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }
}

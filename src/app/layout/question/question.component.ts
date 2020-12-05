import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/shared/services/products.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService, JwtService } from 'src/app/shared/services';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidatorList } from 'src/app/shared/services/validator.service';
import { constant } from 'src/constants/constant';
import { SPINNER, NgxUiLoaderService } from 'ngx-ui-loader';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
    // spinnerType = SPINNER.circle;
    questionForm: FormGroup;
    answerForm: FormGroup;
    public account_validation_messages =
        ValidatorList.account_validation_messages;
    constant: any = constant;

    questions: any = [];
    answers: any = [];

    question = {
        status : 0
    };

    editQuestionbyId = '';
    editQuestionName = '';
    editAnswerName = '';
    editAnswerbyId = '';

    selectedQuestionID: any = '';
    createAnswerStatus = false;
    editableAnswers: any= [];
    submitted: boolean;

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
        this.questionForm = fb.group({
            question_name: ['', [Validators.required, Validators.pattern(/^(?!\s)[a-zA-Z0-9 .,/+=_()'"!@#$?%^&*\s-]*$/)]]
        });

        this.answerForm = fb.group({
            answer_name: ['', [Validators.required, Validators.pattern(/^(?!\s)[a-zA-Z0-9 .,/+=_()'"!@#$?%^&*\s-]*$/)]]
        });
    }

    // get f() { return this.answerForm.controls; }

    ngOnInit(): void {
        this.ngxService.start();
        this.getAllQuestion();
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

    //Check whitespace  function //
    // public noWhitespaceValidator(control: FormControl) {
    //     const isWhitespace = (control.value || '').trim().length === 0;
    //     const isValid = !isWhitespace;
    //     return isValid ? null : { 'whitespace': true };
    // }

    onQuestionSubmit() {
        this.ngxService.start();
        if (this.questionForm.invalid) {
            this.ngxService.stop();
            this.validateAllFormFields(this.questionForm);
            return;
        }
        if (this.questionForm.value.question_name) {
            const category = {
                question_name: this.questionForm.value.question_name
            };
            this.productsService.saveQuestionDetail(category).subscribe(res => {
                if (!res.success) {
                    this.toastr.error(
                        'Error!',
                        res['message'],
                        constant.ToastConfig
                    );
                } else {
                    this.questionForm.reset();
                    this.getAllQuestion();
                    this.toastr.success(
                        'Success!',
                        res['message'],
                        constant.ToastConfig
                    );
                }
            });
            this.ngxService.stop();
        }
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

    getClickQuestion(question_id, i) {
        if (
            this.selectedQuestionID &&
            this.selectedQuestionID === question_id
        ) {
            this.selectedQuestionID = '';
            this.answers = [];
        } else {
            this.selectedQuestionID = question_id;
            this.getSelectedQuestionAnswer(question_id);
        }
    }

    cancelEditQuestions() {
        this.editQuestionbyId = '';
        this.editQuestionName = '';
    }

    editQuestions(questuin, i) {
        this.editQuestionName = questuin.question_name;
        this.editQuestionbyId = questuin.id;
    }

    submitQuestionStatus(event, editQue) {
        if (editQue.id) {
            this.ngxService.start();
            const category = {
                question_name: editQue.question_name,
                id: editQue.id,
                isActivated : editQue.isActivated
            };
            this.productsService.saveQuestionDetail(category).subscribe(res => {
                if (!res.success) {
                    this.toastr.error(
                        'Error!',
                        res['message'],
                        constant.ToastConfig
                    );
                } else {
                    this.questionForm.reset();
                    this.getAllQuestion();
                    this.toastr.success(
                        'Success!',
                        res['message'],
                        constant.ToastConfig
                    );
                }
                this.ngxService.stop();
            });
        }
    }

    submitEditQuestions(question) {
        const isWhitespace = (this.editQuestionName || '').trim().length === 0;
        if (question.id && this.editQuestionName && !(isWhitespace)) {
            this.ngxService.start();
            const newQuestion = {
                question_name: this.editQuestionName,
                id: question.id
            };
            this.productsService
                .saveQuestionDetail(newQuestion)
                .subscribe(res => {
                    if (!res.success) {
                        this.toastr.error(
                            'Error!',
                            res['message'],
                            constant.ToastConfig
                        );
                    } else {
                        this.questionForm.reset();
                        this.editQuestionbyId = '';
                        this.editQuestionName = '';
                        this.getAllQuestion();
                        this.toastr.success(
                            '',
                            res['message'],
                            constant.ToastConfig
                        );
                    }
                    this.ngxService.stop();
                });
        } else {
            this.toastr.warning(
                '',
                'Question is required!',
                constant.ToastConfig
            );
        }
    }

    createAnswers() {
        this.createAnswerStatus = true;
    }

    cancelCreateAnswer() {
        this.answerForm.reset();
        this.createAnswerStatus = false;
    }

    submitCreateAnswer() {
        this.ngxService.start();
        this.submitted = true;

        if (this.answerForm.invalid) {
            this.ngxService.stop();
            this.validateAllFormFields(this.answerForm);
            return;
        }
        if (this.answerForm.value.answer_name !== null) {
            this.submitted = false;
            const answer = {
                answer_name: this.answerForm.value.answer_name,
                question_id: this.selectedQuestionID
            };

            this.productsService.saveAnswerDetail(answer).subscribe(res => {
                if (!res.success) {
                    this.toastr.error(
                        'Error!',
                        res['message'],
                        constant.ToastConfig
                    );
                } else {
                    this.answerForm.reset();
                    this.getSelectedQuestionAnswer(this.selectedQuestionID);
                    this.createAnswerStatus = false;
                    this.toastr.success(
                        'Success!',
                        res['message'],
                        constant.ToastConfig
                    );
                    this.getAllQuestion();
                }
                this.ngxService.stop();
            });
        }

        // this.createAnswerStatus = false;
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
                    this.editableAnswers = res.data;
                }
            });
    }

    editAnswers(answer) {
        // console.log(answer, ' edit answer');
        this.editAnswerName = answer.answer_name;
        this.editAnswerbyId = answer.id;
        // console.log( this.editAnswerName, '  this.editAnswerName ',  this.editAnswerbyId, ' this.editAnswerbyId');
    }

    cancelEditAnswers() {
        this.editAnswerbyId = '';
        this.editAnswerName = '';
    }


    submitEditAnswer(answer) {
        const isWhitespace = (this.editAnswerName || '').trim().length === 0;
        if (answer.id && this.editAnswerName && !(isWhitespace)) {
            this.ngxService.start();
            const newQuestion = {
                answer_name: this.editAnswerName,
                id: answer.id
            };
            this.productsService
                .saveAnswerDetail(newQuestion)
                .subscribe(res => {
                    if (!res.success) {
                        this.toastr.error(
                            'Error!',
                            res['message'],
                            constant.ToastConfig
                        );
                    } else {
                        this.questionForm.reset();
                        this.editAnswerbyId = '';
                        this.editAnswerName = '';
                        this.getSelectedQuestionAnswer(this.selectedQuestionID);
                        this.toastr.success(
                            '',
                            res['message'],
                            constant.ToastConfig
                        );
                    }
                    this.ngxService.stop();
                });
        } else {
            this.toastr.warning(
                '',
                'Answer is required!',
                constant.ToastConfig
            );
        }
    }

    submitAnswerStatus(event, editAns) {
        if (editAns.id) {
            this.ngxService.start();
            // console.log(editAns, ' submitAnswerStatus');
            const category = {
                answer_name: editAns.answer_name,
                id: editAns.id,
                question_id: editAns.question_id,
                isActivated : editAns.isActivated
            };
            this.productsService.saveAnswerDetail(category).subscribe(res => {
                if (!res.success) {
                    this.toastr.error(
                        'Error!',
                        res['message'],
                        constant.ToastConfig
                    );
                } else {
                    this.questionForm.reset();
                    this.getAllQuestion();
                    this.toastr.success(
                        'Success!',
                        res['message'],
                        constant.ToastConfig
                    );
                }
                this.ngxService.stop();
            });
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        let newCurrentIndexPlus;
        let totalAnswerLength;
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
          transferArrayItem(event.previousContainer.data,
                            event.container.data,
                            event.previousIndex,
                            event.currentIndex);
        }
        totalAnswerLength = this.answers.length;
        newCurrentIndexPlus = event.currentIndex + 1;
        if(event.currentIndex + 1 < totalAnswerLength) {
            newCurrentIndexPlus = event.currentIndex + 1;
        } else {
            newCurrentIndexPlus = event.currentIndex - 1;
        }
        // console.log(newCurrentIndexPlus, ' newCurrentIndexPlus');
        const updateAnswer = {
            oldAnswer : {
                id : this.editableAnswers[newCurrentIndexPlus].id,
                position: this.editableAnswers[event.currentIndex].position
            },
            currentAnswer : {
                id : this.editableAnswers[event.currentIndex].id,
                position: this.editableAnswers[newCurrentIndexPlus].position
            }
        };
        this.productsService.updateDragAnswerDetail(updateAnswer).subscribe(res => {
            if (!res.success) {
                this.toastr.error(
                    'Error!',
                    res['message'],
                    constant.ToastConfig
                );
            } else {
                this.answerForm.reset();
                this.getSelectedQuestionAnswer(this.selectedQuestionID);
                this.createAnswerStatus = false;
                // this.toastr.success(
                //     'Success!',
                //     res['message'],
                //     constant.ToastConfig
                // );
            }
            this.ngxService.stop();
        });

      }


}

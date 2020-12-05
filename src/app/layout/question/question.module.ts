import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionRoutingModule } from './question-routing.module';
import { QuestionComponent } from './question.component';
// import { PaginatorModule } from 'primeng/paginator/paginator';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {InputSwitchModule} from 'primeng/inputswitch';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { OrderModule } from 'ngx-order-pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [QuestionComponent],
  imports: [
    CommonModule,
    QuestionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputSwitchModule,
    NgxUiLoaderModule,
    OrderModule,
    DragDropModule,
    InfiniteScrollModule,
    // PaginatorModule,
  ]
})
export class QuestionModule { }

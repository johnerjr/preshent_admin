import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormBuilderComponent } from './form-builder.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { PaginatorModule } from 'primeng/paginator';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  declarations: [FormBuilderComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormBuilderRoutingModule,
    NgxUiLoaderModule,
    PaginatorModule,
    DragDropModule,
    InfiniteScrollModule,
  ]
})
export class FormBuilderModule { }

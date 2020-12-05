import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import {InputSwitchModule} from 'primeng/inputswitch';
import { NgxUiLoaderModule } from 'ngx-ui-loader';


@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    CommonModule,
    FormsModule,
    CategoriesRoutingModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    PaginatorModule,
    InputSwitchModule,
    NgxUiLoaderModule
  ]
})
export class CategoriesModule { }

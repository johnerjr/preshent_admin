import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { ImageCropperModule } from 'ngx-image-cropper';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AddProductsComponent } from './add-products/add-products.component';
import {ProgressBarModule} from 'primeng/progressbar';
import {CheckboxModule} from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import {InputSwitchModule} from 'primeng/inputswitch';
import { NgxCurrencyModule } from 'ngx-currency';
import { TwoDigitDecimaNumberDirective } from 'src/app/two-digit-decima-number.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [ProductsComponent, AddProductsComponent, TwoDigitDecimaNumberDirective],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProductsRoutingModule,
    PaginatorModule,
    ImageCropperModule,
    NgbModule,
    ProgressBarModule,
    CheckboxModule,
    TableModule,
    NgxUiLoaderModule,
    InputSwitchModule,
    NgxCurrencyModule,
    InfiniteScrollModule
  ]
})
export class ProductsModule { }

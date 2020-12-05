import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
// import {ProgressSpinnerModule} from 'primeng/progressspinner';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        LoginRoutingModule,
        DialogModule,
        NgxUiLoaderModule
    ],
    declarations: [LoginComponent]
})
export class LoginModule {}

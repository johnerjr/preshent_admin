import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { RecoveryPasswordRoutingModule } from './recovery-password-routing.module';
import { RecoveryPasswordComponent } from './recovery-password.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RecoveryPasswordComponent],
  imports: [
    CommonModule,
    RecoveryPasswordRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class RecoveryPasswordModule { }

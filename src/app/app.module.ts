import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    bgsColor: '#0185cd',
    bgsPosition: POSITION.bottomCenter,
    bgsSize: 40,
    bgsType: SPINNER.rectangleBounce, // background spinner type
    fgsType: SPINNER.chasingDots, // foreground spinner type
    pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
    pbThickness: 5, // progress bar thickness
  };

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        LanguageTranslationModule,
        AppRoutingModule,
        ToastrModule.forRoot(),
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    ],
    declarations: [AppComponent],
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})

export class AppModule {}

import { ShareComponent } from './components/share/share.component';
import { AllIndustriesComponent } from './all-industries/all-industries.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { SharedModule } from './shared.module';
import { AllCompaniesComponent } from './components/all-companies/all-companies.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { File } from '@ionic-native/file/ngx';
import { DatePipe } from '@angular/common';




@NgModule({
  declarations: [AppComponent, AllCompaniesComponent, AllIndustriesComponent, ShareComponent],
  entryComponents: [AllCompaniesComponent, AllIndustriesComponent, ShareComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    IonicModule.forRoot(),
     IonicStorageModule.forRoot(),
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (LanguageLoader),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    SocialSharing,
    DatePipe,
    // { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Storage
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

export function LanguageLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
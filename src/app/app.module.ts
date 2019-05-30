import { AllIndustriesComponent } from './all-industries/all-industries.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { SharedModule } from './shared.module';
import { AllCompaniesComponent } from './components/all-companies/all-companies.component';

// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
// const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };

@NgModule({
  declarations: [AppComponent, AllCompaniesComponent, AllIndustriesComponent],
  entryComponents: [AllCompaniesComponent, AllIndustriesComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    IonicModule.forRoot(),
     IonicStorageModule.forRoot(),
    //  SocketIoModule.forRoot(config),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Storage
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


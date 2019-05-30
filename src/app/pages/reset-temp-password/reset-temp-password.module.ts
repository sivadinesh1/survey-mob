import { ApiDataResolverService } from './../../services/api-data-resolver.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ResetTempPasswordPage } from './reset-temp-password.page';

const routes: Routes = [
  {
    path: '',
    component: ResetTempPasswordPage,
    resolve: {memberdata: ApiDataResolverService}
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ResetTempPasswordPage]
})
export class ResetTempPasswordPageModule {}

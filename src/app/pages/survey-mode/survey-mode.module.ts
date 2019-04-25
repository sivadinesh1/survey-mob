import { ApiDataResolverService } from 'src/app/services/api-data-resolver.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SurveyModePage } from './survey-mode.page';

const routes: Routes = [
  {
    path: '',
    component: SurveyModePage,
    resolve: {surveydata: ApiDataResolverService}
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SurveyModePage]
})
export class SurveyModePageModule {}

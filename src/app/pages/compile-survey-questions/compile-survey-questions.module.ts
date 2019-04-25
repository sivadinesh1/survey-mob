import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CompileSurveyQuestionsPage } from './compile-survey-questions.page';
import { ApiDataResolverService } from 'src/app/services/api-data-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: CompileSurveyQuestionsPage,
    resolve: {surveydata: ApiDataResolverService}
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CompileSurveyQuestionsPage]
})
export class CompileSurveyQuestionsPageModule {}

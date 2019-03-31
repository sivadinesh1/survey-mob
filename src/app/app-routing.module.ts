import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  // {
  //   path: 'home',
  //   loadChildren: './home/home.module#HomePageModule'
  // },
  
 
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'sign-in', loadChildren: './pages/sign-in/sign-in.module#SignInPageModule' },
  { path: 'sign-up', loadChildren: './pages/sign-up/sign-up.module#SignUpPageModule' },
  { path: 'verify-password', loadChildren: './pages/verify-password/verify-password.module#VerifyPasswordPageModule' },
  { path: 'set-password', loadChildren: './pages/set-password/set-password.module#SetPasswordPageModule' },
  { path: 'set-profile', loadChildren: './pages/set-profile/set-profile.module#SetProfilePageModule' },
  { path: 'new-survey', loadChildren: './pages/new-survey/new-survey.module#NewSurveyPageModule' },
  { path: 'start-survey', loadChildren: './pages/start-survey/start-survey.module#StartSurveyPageModule' },
  { path: 'add-questions', loadChildren: './pages/add-questions/add-questions.module#AddQuestionsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

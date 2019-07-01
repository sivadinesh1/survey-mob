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
  { path: 'new-survey', loadChildren: './pages/new-survey/new-survey.module#NewSurveyPageModule' },
  { path: 'start-survey', loadChildren: './pages/start-survey/start-survey.module#StartSurveyPageModule' },
  { path: 'add-questions/:surveyid/:questionscount', loadChildren: './pages/add-questions/add-questions.module#AddQuestionsPageModule' },
  { path: 'compile-survey-questions/:surveyinfo',
    loadChildren: './pages/compile-survey-questions/compile-survey-questions.module#CompileSurveyQuestionsPageModule' },
  { path: 'survey-mode-start', loadChildren: './pages/survey-mode-start/survey-mode-start.module#SurveyModeStartPageModule' },
  { path: 'survey-mode/:surveycode', loadChildren: './pages/survey-mode/survey-mode.module#SurveyModePageModule' },
  { path: 'survey-results/:survid', loadChildren: './pages/survey-results/survey-results.module#SurveyResultsPageModule' },
  { path: 'daily-reports/:runningsurveyid/:chosendate',
    loadChildren: './pages/survey-results/daily-reports/daily-reports.module#DailyReportsPageModule' },

  { path: 'dashboard/:userid', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'dashboard/:companyid', loadChildren: './pages/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'verify-otp/:phonenumber', loadChildren: './pages/verify-otp/verify-otp.module#VerifyOtpPageModule' },
  { path: 'preview/:previewsurveyid', loadChildren: './pages/preview/preview.module#PreviewPageModule' },
  { path: 'signout', loadChildren: './pages/signout/signout.module#SignoutPageModule' },
  { path: 'edit-questions/:surveyid/:surveyquestionid',
    loadChildren: './pages/edit-questions/edit-questions.module#EditQuestionsPageModule' },
  { path: 'forgot-password', loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordPageModule' },
  { path: 'reset-temp-password/:userid',
    loadChildren: './pages/reset-temp-password/reset-temp-password.module#ResetTempPasswordPageModule' },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'add-member', loadChildren: './pages/add-member/add-member.module#AddMemberPageModule' },
  { path: 'add-company', loadChildren: './pages/add-company/add-company.module#AddCompanyPageModule' },
  { path: 'list-company/:companylistinfo', loadChildren: './pages/list-company/list-company.module#ListCompanyPageModule' },
  { path: 'edit-company/:edit-companyid', loadChildren: './pages/edit-company/edit-company.module#EditCompanyPageModule' },
  { path: 'edit-member', loadChildren: './pages/edit-member/edit-member.module#EditMemberPageModule' },
  { path: 'list-member/:memberlistinfo', loadChildren: './pages/list-member/list-member.module#ListMemberPageModule' },

  { path: 'reports/:surveyid', loadChildren: './pages/survey-results/reports/reports.module#ReportsPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

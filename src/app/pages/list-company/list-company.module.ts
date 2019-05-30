import { ApiDataResolverService } from './../../services/api-data-resolver.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListCompanyPage } from './list-company.page';

const routes: Routes = [
  {
    path: '',
    component: ListCompanyPage,
    resolve: {companieslist: ApiDataResolverService}
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListCompanyPage]
})
export class ListCompanyPageModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtualizaLoginPage } from './atualiza-login.page';

const routes: Routes = [
  {
    path: '',
    component: AtualizaLoginPage
  },
  {
    path: ':id',
    component: AtualizaLoginPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtualizaLoginPageRoutingModule {}

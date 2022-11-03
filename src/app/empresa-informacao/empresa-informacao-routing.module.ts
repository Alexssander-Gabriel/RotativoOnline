import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpresaInformacaoPage } from './empresa-informacao.page';

const routes: Routes = [
  {
    path: '',
    component: EmpresaInformacaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaInformacaoPageRoutingModule {}

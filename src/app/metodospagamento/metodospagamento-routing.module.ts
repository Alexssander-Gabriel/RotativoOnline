import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetodospagamentoPage } from './metodospagamento.page';

const routes: Routes = [
  {
    path: '',
    component: MetodospagamentoPage
  },
  {
    path: ':id',
    component: MetodospagamentoPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetodospagamentoPageRoutingModule {}

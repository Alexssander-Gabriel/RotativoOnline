import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetodospagamentoListaPage } from './metodospagamento-lista.page';

const routes: Routes = [
  {
    path: '',
    component: MetodospagamentoListaPage
  },
  {
    path: ':id',
    component: MetodospagamentoListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetodospagamentoListaPageRoutingModule {}

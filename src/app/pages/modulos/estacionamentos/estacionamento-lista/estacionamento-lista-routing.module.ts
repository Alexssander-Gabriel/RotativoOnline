import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstacionamentoListaPage } from './estacionamento-lista.page';

const routes: Routes = [
  {
    path: '',
    component: EstacionamentoListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstacionamentoListaPageRoutingModule {}

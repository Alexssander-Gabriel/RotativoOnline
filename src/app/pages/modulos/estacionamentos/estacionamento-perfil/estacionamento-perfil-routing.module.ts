import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstacionamentoPerfilPage } from './estacionamento-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: EstacionamentoPerfilPage
  },
  {
    path: ':id',
    component: EstacionamentoPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstacionamentoPerfilPageRoutingModule {}

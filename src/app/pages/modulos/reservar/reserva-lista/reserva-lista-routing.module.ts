import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservaListaPage } from './reserva-lista.page';

const routes: Routes = [
  {
    path: '',
    component: ReservaListaPage
  },
  {
    path: ':id',
    component: ReservaListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservaListaPageRoutingModule {}

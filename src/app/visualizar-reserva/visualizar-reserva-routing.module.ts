import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisualizarReservaPage } from './visualizar-reserva.page';

const routes: Routes = [
  {
    path: '',
    component: VisualizarReservaPage
  },
  {
    path: ':id',
    component: VisualizarReservaPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizarReservaPageRoutingModule {}

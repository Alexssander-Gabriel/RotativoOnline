import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservaVisualizarPage } from './reserva-visualizar.page';

const routes: Routes = [
  {
    path: '',
    component: ReservaVisualizarPage
  },
  {
    path: ':id',
    component: ReservaVisualizarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservaVisualizarPageRoutingModule {}

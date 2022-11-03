import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetodoPagamentoCadastroPage } from './metodo-pagamento-cadastro.page';

const routes: Routes = [
  {
    path: '',
    component: MetodoPagamentoCadastroPage
  },
  {
    path: ':id',
    component: MetodoPagamentoCadastroPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MetodoPagamentoCadastroPageRoutingModule {}

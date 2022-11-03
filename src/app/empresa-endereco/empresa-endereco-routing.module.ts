import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpresaEnderecoPage } from './empresa-endereco.page';

const routes: Routes = [
  {
    path: '',
    component: EmpresaEnderecoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaEnderecoPageRoutingModule {}

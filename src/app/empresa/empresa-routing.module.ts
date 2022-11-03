import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpresaPage } from './empresa.page';

const routes: Routes = [
  {
    path: '',
    component: EmpresaPage
  },
  {
    path: ':id',
    component: EmpresaPage,
  },
  {
    path: 'tabs',
    component: EmpresaPage
    // children:[
    //   {
    //     path:'informacao',
    //     loadChildren: ()=> import('../empresa-informacao/empresa-informacao.module').then(m => m.EmpresaInformacaoPageModule)
    //   },
    //   {
    //     path:'endereco',
    //     loadChildren: ()=> import('../empresa-endereco/empresa-endereco.module').then(m => m.EmpresaEnderecoPageModule)
    //   },
    //   {
    //     path:'sobre',
    //     loadChildren: ()=> import('../empresa-sobre/empresa-sobre.module').then(m => m.EmpresaSobrePageModule)
    //   }
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaPageRoutingModule {}

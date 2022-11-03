import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EmpresaPage } from './empresa/empresa.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'empresa',
    loadChildren: () => import('./empresa/empresa.module').then( m => m.EmpresaPageModule)
  },
  {
    path: 'perfilusuario',
    loadChildren: () => import('./perfilusuario/perfilusuario.module').then( m => m.PerfilusuarioPageModule)
  },
  {
    path: 'reservas',
    loadChildren: () => import('./reservas/reservas.module').then( m => m.ReservasPageModule)
  },
  {
    path: 'reservar',
    loadChildren: () => import('./reservar/reservar.module').then( m => m.ReservarPageModule)
  },
  {
    path: 'atualizar-cadastro',
    loadChildren: () => import('./atualizar-cadastro/atualizar-cadastro.module').then( m => m.AtualizarCadastroPageModule)
  },
  {
    path: 'atualiza-login',
    loadChildren: () => import('./atualiza-login/atualiza-login.module').then( m => m.AtualizaLoginPageModule)
  },
  {
    path: 'empresa-endereco',
    loadChildren: () => import('./empresa-endereco/empresa-endereco.module').then( m => m.EmpresaEnderecoPageModule)
  },
  {
    path: 'empresa-informacao',
    loadChildren: () => import('./empresa-informacao/empresa-informacao.module').then( m => m.EmpresaInformacaoPageModule)
  },
  {
    path: 'empresa-sobre',
    loadChildren: () => import('./empresa-sobre/empresa-sobre.module').then( m => m.EmpresaSobrePageModule)
  },
  {
    path: 'metodospagamento',
    loadChildren: () => import('./metodospagamento/metodospagamento.module').then( m => m.MetodospagamentoPageModule)
  },
  {
    path: 'metodo-pagamento-cadastro',
    loadChildren: () => import('./metodo-pagamento-cadastro/metodo-pagamento-cadastro.module').then( m => m.MetodoPagamentoCadastroPageModule)
  },
  {
    path: 'visualizar-reserva',
    loadChildren: () => import('./visualizar-reserva/visualizar-reserva.module').then( m => m.VisualizarReservaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
    path: 'perfilusuario',
    loadChildren: () => import('./pages/modulos/login/perfilusuario/perfilusuario.module').then( m => m.PerfilusuarioPageModule)
  },
  {
    path: 'atualizar-cadastro',
    loadChildren: () => import('./pages/modulos/login/atualizar-cadastro/atualizar-cadastro.module').then( m => m.AtualizarCadastroPageModule)
  },
  {
    path: 'atualiza-login',
    loadChildren: () => import('./pages/modulos/login/atualiza-login/atualiza-login.module').then( m => m.AtualizaLoginPageModule)
  },
  {
    path: 'metodo-pagamento-cadastro',
    loadChildren: () => import('./pages/modulos/metodospagamentos/metodo-pagamento-cadastro/metodo-pagamento-cadastro.module').then( m => m.MetodoPagamentoCadastroPageModule)
  },
  {
    path: 'estacionamento-lista',
    loadChildren: () => import('./pages/modulos/estacionamentos/estacionamento-lista/estacionamento-lista.module').then( m => m.EstacionamentoListaPageModule)
  },
  {
    path: 'estacionamento-perfil',
    loadChildren: () => import('./pages/modulos/estacionamentos/estacionamento-perfil/estacionamento-perfil.module').then( m => m.EstacionamentoPerfilPageModule)
  },
  {
    path: 'metodospagamento-lista',
    loadChildren: () => import('./pages/modulos/metodospagamentos/metodospagamento-lista/metodospagamento-lista.module').then( m => m.MetodospagamentoListaPageModule)
  },
  {
    path: 'reserva-cadastro',
    loadChildren: () => import('./pages/modulos/reservar/reserva-cadastro/reserva-cadastro.module').then( m => m.ReservaCadastroPageModule)
  },
  {
    path: 'reserva-lista',
    loadChildren: () => import('./pages/modulos/reservar/reserva-lista/reserva-lista.module').then( m => m.ReservaListaPageModule)
  },
  {
    path: 'reserva-visualizar',
    loadChildren: () => import('./pages/modulos/reservar/reserva-visualizar/reserva-visualizar.module').then( m => m.ReservaVisualizarPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

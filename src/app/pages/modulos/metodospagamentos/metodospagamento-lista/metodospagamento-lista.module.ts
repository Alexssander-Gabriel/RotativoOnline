import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetodospagamentoListaPageRoutingModule } from './metodospagamento-lista-routing.module';

import { MetodospagamentoListaPage } from './metodospagamento-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetodospagamentoListaPageRoutingModule
  ],
  declarations: [MetodospagamentoListaPage]
})
export class MetodospagamentoListaPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetodospagamentoPageRoutingModule } from './metodospagamento-routing.module';

import { MetodospagamentoPage } from './metodospagamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetodospagamentoPageRoutingModule
  ],
  declarations: [MetodospagamentoPage]
})
export class MetodospagamentoPageModule {}

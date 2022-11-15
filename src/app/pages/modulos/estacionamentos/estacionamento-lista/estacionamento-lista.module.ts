import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstacionamentoListaPageRoutingModule } from './estacionamento-lista-routing.module';

import { EstacionamentoListaPage } from './estacionamento-lista.page';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstacionamentoListaPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [EstacionamentoListaPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class EstacionamentoListaPageModule {}

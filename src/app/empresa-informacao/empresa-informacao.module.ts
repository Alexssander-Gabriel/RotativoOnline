import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpresaInformacaoPageRoutingModule } from './empresa-informacao-routing.module';

import { EmpresaInformacaoPage } from './empresa-informacao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpresaInformacaoPageRoutingModule
  ],
  declarations: [EmpresaInformacaoPage]
})
export class EmpresaInformacaoPageModule {}

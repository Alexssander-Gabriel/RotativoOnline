import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstacionamentoPerfilPageRoutingModule } from './estacionamento-perfil-routing.module';

import { EstacionamentoPerfilPage } from './estacionamento-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstacionamentoPerfilPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EstacionamentoPerfilPage]
})
export class EstacionamentoPerfilPageModule {}

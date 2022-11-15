import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservaListaPageRoutingModule } from './reserva-lista-routing.module';

import { ReservaListaPage } from './reserva-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservaListaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ReservaListaPage]
})
export class ReservaListaPageModule {}

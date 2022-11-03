import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisualizarReservaPageRoutingModule } from './visualizar-reserva-routing.module';

import { VisualizarReservaPage } from './visualizar-reserva.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisualizarReservaPageRoutingModule
  ],
  declarations: [VisualizarReservaPage]
})
export class VisualizarReservaPageModule {}

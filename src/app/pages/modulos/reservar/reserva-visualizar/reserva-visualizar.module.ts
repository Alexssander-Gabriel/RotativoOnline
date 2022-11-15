import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservaVisualizarPageRoutingModule } from './reserva-visualizar-routing.module';

import { ReservaVisualizarPage } from './reserva-visualizar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservaVisualizarPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ReservaVisualizarPage]
})
export class ReservaVisualizarPageModule {}

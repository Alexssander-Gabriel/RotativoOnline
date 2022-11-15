import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservaCadastroPageRoutingModule } from './reserva-cadastro-routing.module';

import { ReservaCadastroPage } from './reserva-cadastro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservaCadastroPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ReservaCadastroPage]
})
export class ReservaCadastroPageModule {}

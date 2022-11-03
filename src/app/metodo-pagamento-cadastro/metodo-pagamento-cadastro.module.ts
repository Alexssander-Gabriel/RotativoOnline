import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MetodoPagamentoCadastroPageRoutingModule } from './metodo-pagamento-cadastro-routing.module';

import { MetodoPagamentoCadastroPage } from './metodo-pagamento-cadastro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MetodoPagamentoCadastroPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MetodoPagamentoCadastroPage]
})
export class MetodoPagamentoCadastroPageModule {}

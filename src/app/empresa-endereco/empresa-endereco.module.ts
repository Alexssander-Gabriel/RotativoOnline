import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpresaEnderecoPageRoutingModule } from './empresa-endereco-routing.module';

import { EmpresaEnderecoPage } from './empresa-endereco.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpresaEnderecoPageRoutingModule
  ],
  declarations: [EmpresaEnderecoPage]
})
export class EmpresaEnderecoPageModule {}

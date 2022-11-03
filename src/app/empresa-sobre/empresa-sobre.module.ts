import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpresaSobrePageRoutingModule } from './empresa-sobre-routing.module';

import { EmpresaSobrePage } from './empresa-sobre.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpresaSobrePageRoutingModule
  ],
  declarations: [EmpresaSobrePage]
})
export class EmpresaSobrePageModule {}

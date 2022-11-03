import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtualizaLoginPageRoutingModule } from './atualiza-login-routing.module';

import { AtualizaLoginPage } from './atualiza-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtualizaLoginPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AtualizaLoginPage]
})
export class AtualizaLoginPageModule {}

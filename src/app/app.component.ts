import { Component } from '@angular/core';
import { UtilsService } from './services/utils/utils.service';
import { User } from './model/login.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  user : User;
  nomeUsuario : string;
  constructor(private utilsService: UtilsService) {}

  ngOnInit() {
    this.retornaNomeUsuario();
  }

  ionViewWillEnter(): void {
    //this.retornaNomeUsuario();
  }

  retornaNomeUsuario(){
    this.user = this.utilsService.getUsuario();
    if (this.user !== undefined && this.user){
      this.nomeUsuario = this.user.NomeUsuario;
    }
  }

}

import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Reserva } from '../model/reservas.model';
import { ReservasService } from '../api/reservas/reservas.service';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { User } from '../model/login.model';
import { UtilsService } from '../utils/utils.service';
import { MensagemService } from '../services/mensagem/mensagem.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {

  loading : boolean = false;
  reservas : Reserva[];
  usuario : User;
  corLinha : string;

  constructor(private reservasService: ReservasService,
              private router: Router,
              private actionSheetController: ActionSheetController,
              private utilsService: UtilsService,
              private mensagemService: MensagemService) { }

  ngOnInit() {
    console.log("entrou aqui");
    this.corLinha = 'Primary';
  }

  ionViewWillEnter(): void {
    this.usuario = this.utilsService.getUsuario("/home", true);

    if (this.usuario !== undefined && this.usuario){
      this.listReservas(this.usuario.CadastroId);
    }

  }

  listReservas(id : number){
    console.log("entro na lista de reservas");
    this.loading = true;
    this.reservasService
    .getReservaCadastro(id)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (dados) => {
        this.reservas = dados;
        if (this.reservas !== undefined && this.reservas){
          var passou = 1;
          this.reservas.forEach(x => {
            x.UrlFoto = this.utilsService.formataUrlFoto(x.UrlFoto);
             if (passou == 1){
              x.DiaSemana = 'Terça-Feira'
             } else {
              x.DiaSemana = 'Segunda-Feira'
             }
             passou++;
          });

          this.reservas.sort(function(a,b){
            //if (a.DataEntrada > b.DataEntrada) return 1;
            //if (a.DataEntrada < b.DataSaida) return -1;
            return 0;
          })
        }
      },
      async (error) => {
        console.log("deu errado viu");
        console.log(error.error);
      }
    );
  }

  async abrirListaAcao(reserva : Reserva) {
    const actionSheet = await this.actionSheetController.create({
      header: `${reserva.NomeEstacionamento}`,
      //subHeader: `${this.utilsService.retornaDia(reserva.DataEntrada,true)} ${this.utilsService.formataData(reserva.DataEntrada.toString},false) - ${reserva.HoraEntrada}`,
      subHeader: `Terça-Feira, 01/11/2022 - 01:19:29`,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Visualizar',
        role: 'destructive',
        icon: 'eye-outline',
        handler: () => {
          this.router.navigate(['/visualizar-reserva',reserva.ReservaId]);
        }
      },{
        text: 'Cancelar Reserva',
        role: 'destructive',
        icon: 'trash-outline',
        handler:() => {
          //this.excluir(produto);
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  // abrirTela(){
  //   this.router.navigate(['/reservar']);
  // }

}

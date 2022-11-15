import { Dados } from './../../../../model/dados.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { User } from 'src/app/model/login.model';
import { Reserva } from 'src/app/model/reservas.model';
import { MensagemService } from 'src/app/services/mensagem/mensagem.service';
import { ReservasService } from 'src/app/services/reservas/reservas.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reserva-lista',
  templateUrl: './reserva-lista.page.html',
  styleUrls: ['./reserva-lista.page.scss'],
})
export class ReservaListaPage implements OnInit {

  loading : boolean = false;
  reservas : Reserva[];
  usuario : User;
  corLinha : string;
  reservaUtilizadas : Reserva[];
  dados : Dados;

  constructor(private reservasService: ReservasService,
              private router: Router,
              private actionSheetController: ActionSheetController,
              private utilsService: UtilsService,
              private mensagemService: MensagemService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }

  ionViewWillEnter(): void {
    const id = +this.activatedRoute.snapshot.params.id;
    this.listReservas(id);
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
            x.DiaSemana = this.utilsService.retornaDia(x.DataEntrada,true);
          });

          this.reservas.sort(function(a,b){
            //if (a.DataEntrada > b.DataEntrada) return 1;
            //if (a.DataEntrada < b.DataSaida) return -1;
            return 0;
          })
        } else {
          this.reservas = null;
        }
      },
      async (error) => {
        console.log("deu errado viu");
        console.log(error.error);
      }
    );
  }


  listReservaUtilizada(id : number){
    console.log("Lista de reservas utilizadas");
    this.loading = true;
    this.reservasService
    .getReservasUtilizadas(id)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (dados) => {
        console.log(dados);
        if (dados.dados == "Não existem dados para retornar"){
          console.log("deu certo a verificação");
          this.cancelarReserva(id);
        } else {
          this.mensagemService.error("Não é possível cancelar uma reserva que já foi finalizada.",()=>{});
          return;
        }
        // this.reservaUtilizadas = dados;
        // if (this.reservaUtilizadas !== undefined && this.reservaUtilizadas.length > 0){
        //   this.cancelarReserva(id);
        // }
      },
      async (error) => {
        console.log("deu errado viu");
        console.log(error.error);
      }
    );
  }


  cancelarReserva(id : number){
    console.log("vamos cancelar a reserva");
    this.loading = true;
    this.reservasService
    .cancelarReserva(id)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (dados) => {
        if (dados.dados == 'Reserva cancelada com sucesso'){
          this.mensagemService.success(dados.dados);
          const id = +this.activatedRoute.snapshot.params.id;
          this.listReservas(id);
        } else {
          this.mensagemService.error(dados.dados, ()=>{});
        }
      },
      async (error) => {
        this.mensagemService.error("Erro ao cancelar reserva, tente novamente.",()=>{});
        console.log("deu errado viu");
        console.log(error.error);
      }
    );
  }

  async abrirListaAcao(reserva : Reserva) {
    const actionSheet = await this.actionSheetController.create({
      header: `${reserva.NomeEstacionamento}`,
      subHeader: `${this.utilsService.retornaDia(reserva.DataEntrada,true)}, ${this.utilsService.formataData(reserva.DataEntrada.toLocaleString(),false)} - ${reserva.HoraEntrada}`,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Visualizar',
        role: 'destructive',
        icon: 'eye-outline',
        handler: () => {
          //this.router.navigate(['/visualizar-reserva',reserva.ReservaId]);
          this.router.navigate(['/reserva-visualizar',reserva.ReservaId]);
        }
      },{
        text: 'Cancelar Reserva',
        role: 'destructive',
        icon: 'trash-outline',
        handler:() => {
          //this.excluir(produto);
          this.listReservaUtilizada(reserva.ReservaId);
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

}


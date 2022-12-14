import { NgControlStatusGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { Estacionamento } from 'src/app/model/estacionamentos.model';
import { User } from 'src/app/model/login.model';
import { EstacionamentosService } from 'src/app/services/estacionamentos/estacionamentos.service';
import { MensagemService } from 'src/app/services/mensagem/mensagem.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-estacionamento-lista',
  templateUrl: './estacionamento-lista.page.html',
  styleUrls: ['./estacionamento-lista.page.scss'],
})
export class EstacionamentoListaPage implements OnInit {

  estacionamentos : Estacionamento[];
  loading : boolean = false;
  consulta : string;
  user : User;
  filtroPrecisoAtivo : boolean = false;

  constructor(private router : Router,
              private estacionamentosService : EstacionamentosService,
              private actionSheetController: ActionSheetController,
              private mensagemService : MensagemService,
              private utilsService: UtilsService,
              private alertController: AlertController) { }

  ngOnInit() {
    this.filtroPrecisoAtivo = false;
  }

  ionViewWillEnter(): void {
    this.listEstacionamentos();
  }

  public options = [
    {icon :'search-outline' , text: 'Explorar' , rota: '/estacionamento-lista'},
    {icon :'clipboard-outline' , text: 'Reservas' , rota: '/reserva-lista'},
    {icon :'person-circle-outline' , text: 'Perfil' , rota: '/perfilusuario'}
  ]

  public slideOptions : any = { slidesPerView: 3 }

  perfilEmpresa(rota : string) {
    this.router.navigate([rota]);
  }

  abrirTela(rota : string){
    this.user = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (rota == "/perfilusuario"){
      if (this.user == undefined || !this.user){
        this.mensagemService.error("Voc?? precisa estar logado para acessar as op????es de perfil!",()=>{});
        this.router.navigate(["/welcome/sign-in"]);
      } else {
        this.router.navigate([rota]);
      }
    } else if (rota == "/reserva-lista" || rota == "/reserva-cadastro") {
      this.user = this.utilsService.getUsuario(undefined,true,"Voc?? precisa estar logado para visualizar o hist??rico de reservas.");
      if (this.user !== undefined && this.user){
        this.router.navigate([rota, this.user.CadastroId]);
      }
    } else {
      this.router.navigate([rota]);
    }
  }

  listEstacionamentos(){
    console.log("pegou lista de estacionamentos");
    this.loading = true;
    this.estacionamentosService
    .getEstacionamentos()
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (dados) => {
        console.log(dados);
        this.estacionamentos = dados;
        this.estacionamentos.forEach(x => {
          x.UrlFoto = this.utilsService.formataUrlFoto(x.UrlFoto);
        });
      },
      async (error) => {
        console.log(error.error);
      }
    );
  }

  async abrirListaAcao(estacionamentinho : Estacionamento) {
    const actionSheet = await this.actionSheetController.create({
      header: `${estacionamentinho.NomeEstacionamento}`,
      subHeader: `${estacionamentinho.NomeCidade}`,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Reservar',
        role: 'destructive',
        icon: 'clipboard-outline',
        handler: () => {
          this.user = this.utilsService.getUsuario("",true,"Voc?? precisa estar logado para realizar uma reserva.");
          if (this.user !== undefined && this.user){
            this.router.navigate(['/reserva-cadastro', estacionamentinho.EstacionamentoId]);
          }
        }
      },{
        text: 'Localizar',
        role: 'destructive',
        icon: 'location-outline',
        handler:() => {
          if (estacionamentinho.LinkMaps !== undefined && estacionamentinho.LinkMaps.trim().length > 0){
            this.presentAlertDirecionaLocalizacao(estacionamentinho.LinkMaps);
          } else {
            this.mensagemService.error(`O estacionamento n??o cont??m localiza????o dispon??vel no momento`,()=>{});
          }
        }
      },{
        text: 'Perfil',
        role: 'destructive',
        icon: 'search-outline',
        handler:() => {
          this.router.navigate(['/estacionamento-perfil', estacionamentinho.EstacionamentoId]);
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


  async presentAlertDirecionaLocalizacao(localizacao : string) {
    const alert = await this.alertController.create({
      header: 'Deseja ser redirecionado para a localiza????o?',
      buttons: [
        {
          text: 'N??o',
          role: 'cancel',
          handler: () => {

          },
        },
        {
          text: 'Sim',
          role: 'confirm',
          handler: () => {
            window.open(localizacao, '_system');
          },
        },
      ],
    });

    await alert.present();
  }


  filtroPreciso(){
    this.loading = true;
    this.filtroPrecisoAtivo = this.filtroPrecisoAtivo ? false : true;

    if (this.filtroPrecisoAtivo){

      this.estacionamentosService
      .getFiltroPreciso()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (dados) => {
          //console.log(dados);

          // @ts-ignore
          if (dados.dados == 'N??o existem dados para retornar'){
            this.mensagemService.error("N??o existem estacionamentos dispon??veis no momento para a loca????o.",()=>{});
            this.estacionamentos = undefined;
            console.log("deu errado aqui");
          } else {
            this.mensagemService.success("Filtro preciso ativado, somente estacionamentos dispon??vels no momento para loca????o.");
            this.estacionamentos = dados;

            this.estacionamentos.forEach(x => {
              x.UrlFoto = this.utilsService.formataUrlFoto(x.UrlFoto);
            });
          }
        },
        async (error) => {
          console.log(error.error);
        }
      );
    } else {
      this.listEstacionamentos();
    }
  }

}


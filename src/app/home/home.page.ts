import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Estacionamento } from '../model/estacionamentos.model';
import { EstacionamentosService } from '../api/estacionamentos/estacionamentos.service';
import { finalize } from 'rxjs/operators';
import { MensagemService } from '../services/mensagem/mensagem.service';
import { User } from 'src/app/model/login.model';
import { ActionSheetController, AlertController ,  ViewWillEnter } from '@ionic/angular';
import { UtilsService } from '../utils/utils.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {

  estacionamentos : Estacionamento[];
  loading : boolean = false;
  consulta : string;
  user : User;

  constructor(private router : Router,
              private estacionamentosService : EstacionamentosService,
              public actionSheetController: ActionSheetController,
              private mensagemService : MensagemService,
              private utilsService: UtilsService,
              private alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewWillEnter(): void {
    this.listEstacionamentos();
  }

  public options = [
    {icon :'search-outline' , text: 'Explorar' , rota: '/home'},
    {icon :'clipboard-outline' , text: 'Reservas' , rota: '/reservas'},
    {icon :'person-circle-outline' , text: 'Perfil' , rota: '/perfilusuario'}
  ]

  public optionsCard = [
    {icon :'location-outline' , text: 'Localizar' , rota: '../produto-list'},
    {icon :'clipboard-outline' , text: 'Reservar' , rota: '/reservar'},
    {icon :'search-outline' , text: 'Perfil' , rota: '/empresa'},
  ]

  public slideOptions : any = { slidesPerView: 3 }

  perfilEmpresa(rota : string){
    this.router.navigate([rota]);
  }

  abrirTela(rota : string){
    console.log("aqui caralho " + rota);
    this.user = JSON.parse(sessionStorage.getItem('usuarioLogado'));

    if (rota == "/perfilusuario"){
      if (this.user == undefined || !this.user){
        this.mensagemService.error("Você precisa estar logado para acessar as opções de perfil!",()=>{});
        this.router.navigate(["/welcome/sign-in"]);
      } else {
        this.router.navigate([rota]);
      }
    } else {
      console.log("chegou bem aqui caralho era pra ir pra reserva " + rota);
      this.router.navigate([rota]);
    }
  }

  listEstacionamentos(){
    console.log("entro na lista de estacionamento");
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
        console.log()
        this.estacionamentos = dados;
        this.estacionamentos.forEach(x => {
          x.UrlFoto = this.utilsService.formataUrlFoto(x.UrlFoto);
          // if (x.UrlFoto != undefined && x.UrlFoto.length > 0){
          //   x.UrlFoto = x.UrlFoto.replace(".PNG",".png");
          //   x.UrlFoto = x.UrlFoto.replace(".JPG",".jpg");
          //   x.UrlFoto = x.UrlFoto.replace(".JPEG",".jpeg");

          //   if (x.UrlFoto.indexOf(',') != -1){
          //     var foto = x.UrlFoto.substring(0,x.UrlFoto.indexOf(','));
          //     x.UrlFoto = "/assets/imgs" + foto;
          //   } else {
          //     x.UrlFoto = "/assets/imgs" + x.UrlFoto;
          //   }
          //   console.log("Depois :", x.UrlFoto);
          // } else {
          //   x.UrlFoto = "/assets/imgs/estacionamentos/semimagem.png";
          // }
        });
      },
      async (error) => {
        console.log("deu errado viu");
        console.log(error.error);
      }
    );
  }

  async abrirListaAcao(estacionamentinho : Estacionamento) {
    console.log("chegou a abrir");
    const actionSheet = await this.actionSheetController.create({
      header: `${estacionamentinho.NomeEstacionamento}`,
      subHeader: `${estacionamentinho.NomeCidade}`,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Reservar',
        role: 'destructive',
        icon: 'clipboard-outline',
        handler: () => {
          this.router.navigate(['/reservar', estacionamentinho.EstacionamentoId]);
        }
      },{
        text: 'Localizar',
        role: 'destructive',
        icon: 'location-outline',
        handler:() => {
          //this.excluir(produto);
          window.open("https://www.google.com.br", '_system');
        }
      },{
        text: 'Perfil',
        role: 'destructive',
        icon: 'search-outline',
        handler:() => {
          console.log(estacionamentinho);
          this.router.navigate(['/empresa', estacionamentinho.EstacionamentoId]);
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


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Please enter your info',
      buttons: ['OK'],
      message: "DEU RUIM GALERA",
      inputs: [
        {
          placeholder: 'Name',
        },
        {
          placeholder: 'Nickname (max 8 characters)',
          attributes: {
            maxlength: 8,
          },
        },
        {
          type: 'number',
          placeholder: 'Age',
          min: 1,
          max: 100,
        },
        {
          type: 'textarea',
          placeholder: 'A little about yourself',
          value: "CARALHOOOOOOOOOOOO"
        },
      ],
    });

    await alert.present();
  }


}

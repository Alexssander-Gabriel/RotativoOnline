import { User } from 'src/app/model/login.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { DiasAtendimento } from 'src/app/model/diasatendimento.model';
import { EstacionamentosService } from 'src/app/services/estacionamentos/estacionamentos.service';
import { MensagemService } from 'src/app/services/mensagem/mensagem.service';
import { DiasatendimentoService } from 'src/app/services/diasatendimento/diasatendimento.service';
import { AlertController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { EstacionamentoFotos } from 'src/app/model/estacionamentofotos.model';

@Component({
  selector: 'app-estacionamento-perfil',
  templateUrl: './estacionamento-perfil.page.html',
  styleUrls: ['./estacionamento-perfil.page.scss'],
})
export class EstacionamentoPerfilPage implements OnInit {

  loading : boolean = false;
  EstacionamentoId: Number;
  NomeEstacionamento: string;
  BairroEndereco: string;
  Email: string;
  Endereco: string;
  NumeroCep: string;
  NumeroEndereco: string;
  NumeroTelefone1: string;
  NumeroTelefone2: string;
  NumeroVagas: number;
  PrecoHora: number;
  PrecoLivre: number;
  Sobre: string;
  NomeCidade: string;
  Estado: string;
  UrlFoto: string;
  Complemento: string;
  LinkMaps : string;
  DiasAtendimento : DiasAtendimento[];
  user : User;
  mostraDiasAtendimento : boolean = false;
  fotosEstacionamento : EstacionamentoFotos;

  public slideOptions : any = { slidesPerView: 3 }

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private mensagemService: MensagemService,
              private estacionamentosService: EstacionamentosService,
              private diasatendimentoService: DiasatendimentoService,
              private alertController: AlertController,
              private utilsService: UtilsService ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){

    const id = +this.activatedRoute.snapshot.params.id;

    this.listDiasAtendimento(id);

    if (id) {
      this.findById(id);
      this.listFotosEstacionamento(id);
    }

  }

  onSubmit(){
    this.user = this.utilsService.getUsuario('/sign-in',true,"Você precisa estar logado para realizar uma reserva.");
    if (this.user !== undefined && this.user){
      this.router.navigate(['/reserva-cadastro',this.EstacionamentoId]);
    }
  }

  findById(id){
    this.loading = true;
    this.estacionamentosService
      .getEstacionamento(id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (estacionamentoApi) => {
          if (estacionamentoApi) {
            localStorage.setItem("empresa",JSON.stringify(estacionamentoApi));
            console.log(estacionamentoApi);
            this.NomeEstacionamento = estacionamentoApi.NomeEstacionamento;
            this.Email = estacionamentoApi.Email;
            this.Endereco = estacionamentoApi.Endereco;
            this.Estado = estacionamentoApi.Estado;
            this.NomeCidade = estacionamentoApi.NomeCidade;
            this.NumeroCep = estacionamentoApi.NumeroCep;
            this.NumeroEndereco = estacionamentoApi.NumeroEndereco;
            this.NumeroTelefone1 = estacionamentoApi.NumeroTelefone1;
            this.NumeroTelefone2 = estacionamentoApi.NumeroTelefone2;
            this.EstacionamentoId = estacionamentoApi.EstacionamentoId;
            this.Sobre = estacionamentoApi.Sobre;
            this.PrecoHora = estacionamentoApi.PrecoHora;
            this.PrecoLivre = estacionamentoApi.PrecoLivre;
            this.Complemento = estacionamentoApi.Complemento;
            this.BairroEndereco = estacionamentoApi.BairroEndereco;
            this.UrlFoto = estacionamentoApi.UrlFoto;
            this.LinkMaps = estacionamentoApi.LinkMaps;

            // if(this.UrlFoto != undefined && this.UrlFoto.length > 0){
            //   this.UrlFoto = this.UrlFoto.replace(".PNG",".png");
            //   this.UrlFoto = this.UrlFoto.replace(".JPG",".jpg");
            //   this.UrlFoto = this.UrlFoto.replace(".JPEG",".jpeg");

            //   if (this.UrlFoto.indexOf(',') != -1){
            //     var foto = this.UrlFoto.substring(0,this.UrlFoto.indexOf(','));
            //     this.UrlFoto = "/assets/imgs" + foto;
            //   } else {
            //     this.UrlFoto = "/assets/imgs" + this.UrlFoto;
            //   }
            // } else {
            //   this.UrlFoto = "/assets/imgs/estacionamentos/semimagem.png";
            // }

            this.UrlFoto = this.utilsService.formataUrlFoto(this.UrlFoto);

            //console.log("caminho: ", this.UrlFoto);
          }

        },
        () =>
          this.mensagemService.error(
            `Erro ao buscar informações do estacionamento`,
            () => this.findById(id)
          )
      );
  }

  listDiasAtendimento(id : number){
    this.loading = true;
    this.diasatendimentoService
    .getDiasAtendimentoByEstacionamentoId(id)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (dados) => {
        this.DiasAtendimento = dados;
        this.mostraDiasAtendimento = this.DiasAtendimento.length > 0;
      },
      async (error) => {
        console.log(error.error);
      }
    );
  }

  listFotosEstacionamento(id : number){
    this.loading = true;
    this.estacionamentosService
    .getFotosEstacionamento(id)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (dados) => {
        this.fotosEstacionamento = dados;
      },
      async (error) => {
        console.log(error.error);
      }
    );
  }

  abrirRedirecionar(){
    if (this.LinkMaps !== undefined && this.LinkMaps.trim().length > 0){
      this.presentAlertDirecionaLocalizacao(this.LinkMaps);
    } else {
      this.mensagemService.error(`O estacionamento não contém localização disponível no momento`,()=>{});
    }
  }


  async presentAlertDirecionaLocalizacao(localizacao : string) {
    const alert = await this.alertController.create({
      header: 'Deseja ser redirecionado para a localização?',
      buttons: [
        {
          text: 'Não',
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

}

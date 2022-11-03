import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MensagemService } from '../services/mensagem/mensagem.service';
import { EstacionamentosService } from '../api/estacionamentos/estacionamentos.service';
import { finalize } from 'rxjs/operators';
import { Estacionamento } from '../model/estacionamentos.model';
import { appInitialize } from '@ionic/angular/app-initialize';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.page.html',
  styleUrls: ['./empresa.page.scss'],
})
export class EmpresaPage implements OnInit {

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
  DescricaoDiasAtendimento: string;
  UrlFoto: string;
  Complemento: string;

  public optionsEmpresa = [
    {icon :'information-circle' , text: 'Informações' , rota: '../produto-list'},
    {icon :'navigate-outline' , text: 'Endereço' , rota: '/empresa-endereco'},
    {icon :'ellipsis-horizontal-circle-outline' , text: 'Sobre' , rota: '/empresa-sobre'}
  ]

  public slideOptions : any = { slidesPerView: 3 }

  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private mensagemService: MensagemService,
              private httpCliente: HttpClient,
              private estacionamentosService: EstacionamentosService) { }

  ngOnInit() {

    const id = +this.activatedRoute.snapshot.params.id;

    if (id) {
      this.findById(id);
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
            console.log("chegou aqui no find by id");
            console.log(estacionamentoApi);
            this.NomeEstacionamento = estacionamentoApi.NomeEstacionamento;
            this.DescricaoDiasAtendimento = estacionamentoApi.DescricaoDiasAtendimento;
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
            console.log("foto chegou assim" + this.UrlFoto);

            if(this.UrlFoto != undefined && this.UrlFoto.length > 0){
              this.UrlFoto = this.UrlFoto.replace(".PNG",".png");
              this.UrlFoto = this.UrlFoto.replace(".JPG",".jpg");
              this.UrlFoto = this.UrlFoto.replace(".JPEG",".jpeg");
              console.log("como ja esta a foto " + this.UrlFoto );
                    
              if (this.UrlFoto.indexOf(',') != -1){
                console.log("pegar foto");
                var foto = this.UrlFoto.substring(0,this.UrlFoto.indexOf(','));
                this.UrlFoto = "/assets/imgs" + foto;
              } else {
                console.log("vai como esta");
                this.UrlFoto = "/assets/imgs" + this.UrlFoto;
              }
            } else {
              this.UrlFoto = "/assets/imgs/estacionamentos/semimagem.png";
            }
          }
        },
        () =>
          this.mensagemService.error(
            `Erro ao buscar informações do estacionamento`,
            () => this.findById(id)
          )
      );
  }

  onSubmit(){
    this.router.navigate(['/reservar',this.EstacionamentoId]);
  }

  abrirTela(rota: string){
    this.router.navigate([rota]);
  }

}

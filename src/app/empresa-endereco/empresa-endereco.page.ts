import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EstacionamentosService } from '../api/estacionamentos/estacionamentos.service';
import { finalize } from 'rxjs/operators';
import { MensagemService } from '../services/mensagem/mensagem.service';
import { Estacionamento } from '../model/estacionamentos.model';

@Component({
  selector: 'app-empresa-endereco',
  templateUrl: './empresa-endereco.page.html',
  styleUrls: ['./empresa-endereco.page.scss'],
})
export class EmpresaEnderecoPage implements OnInit {
  
  loading : boolean = false;
  estacionamento : Estacionamento;
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
    {icon :'information-circle' , text: 'Informações' , rota: '/empresa'},
    {icon :'navigate-outline' , text: 'Endereço' , rota: '/empresa-endereco'},
    {icon :'ellipsis-horizontal-circle-outline' , text: 'Sobre' , rota: '/empresa-sobre'}
  ]

  public slideOptions : any = { slidesPerView: 3 }

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private httpCliente: HttpClient,
              private estacionamentosService: EstacionamentosService,
              private mensagemService: MensagemService ) { }

  ngOnInit() {
    this.estacionamento = JSON.parse(localStorage.getItem("empresa"));
    if (this.estacionamento && this.estacionamento != undefined){
      this.mapeiaEmpresa(this.estacionamento);
    } else {
      const id = +this.activatedRoute.snapshot.params.id;

      if (id) {
        this.findById(id);
      }
    }
  }

  onSubmit(){

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
            console.log("chegou aqui no find by id");
            console.log(estacionamentoApi);
            this.mapeiaEmpresa(estacionamentoApi);
          }
        },
        () =>
          this.mensagemService.error(
            `Erro ao buscar informações do estacionamento`,
            () => this.findById(id)
          )
      );
  }

  abrirTela(rota: string){
    console.log(this.EstacionamentoId);
    if (rota == '/empresa'){
      this.router.navigate([rota, this.EstacionamentoId]);
    } else {
      this.router.navigate([rota]);
    }
  }

  mapeiaEmpresa(estacionamentinho : Estacionamento){
    this.NomeEstacionamento = estacionamentinho.NomeEstacionamento;
    this.DescricaoDiasAtendimento = estacionamentinho.DescricaoDiasAtendimento;
    this.Email = estacionamentinho.Email;
    this.Endereco = estacionamentinho.Endereco;
    this.Estado = estacionamentinho.Estado;
    this.NomeCidade = estacionamentinho.NomeCidade;
    this.NumeroCep = estacionamentinho.NumeroCep;
    this.NumeroEndereco = estacionamentinho.NumeroEndereco;
    this.NumeroTelefone1 = estacionamentinho.NumeroTelefone1;
    this.NumeroTelefone2 = estacionamentinho.NumeroTelefone2;
    this.EstacionamentoId = estacionamentinho.EstacionamentoId;
    this.Sobre = estacionamentinho.Sobre;
    this.PrecoHora = estacionamentinho.PrecoHora;
    this.PrecoLivre = estacionamentinho.PrecoLivre;
    this.Complemento = estacionamentinho.Complemento;
    this.BairroEndereco = estacionamentinho.BairroEndereco;
    this.UrlFoto = estacionamentinho.UrlFoto;
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
}

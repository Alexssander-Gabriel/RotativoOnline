import { Estacionamento } from 'src/app/model/estacionamentos.model';
import { Reservar, VerificacaoProps } from 'src/app/model/reservar.model';
import { ReservarService } from 'src/app/services/reservar/reservar.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MensagemService } from 'src/app/services/mensagem/mensagem.service';
import { ActivatedRoute } from '@angular/router';
import { ReservasService } from 'src/app/services/reservas/reservas.service';
import { finalize } from 'rxjs/operators';
import { Time } from '@angular/common';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { EstacionamentosService } from 'src/app/services/estacionamentos/estacionamentos.service';
import { ReservarClass } from 'src/app/model/reservar.model';


@Component({
  selector: 'app-reserva-visualizar',
  templateUrl: './reserva-visualizar.page.html',
  styleUrls: ['./reserva-visualizar.page.scss'],
})
export class ReservaVisualizarPage implements OnInit {

  loading : boolean = false;
  EstacionamentoId: number;
  NomeEstacionamento: string;
  DescricaoFormaPagamento: string;
  Valor: number;
  DataEntrada: string;
  HoraEntrada: Time;
  DataSaida: string;
  HoraSaida: Time;
  STATUS: string;
  DescricaoMetodoPagamento: string;
  ReservarM : ReservarClass;
  Estacionamento : Estacionamento;
  calculoValores : VerificacaoProps;
  tempoDesc : string;
  observacao: string;


  constructor(private router: Router,
              private mensagemService: MensagemService,
              private activatedRoute: ActivatedRoute,
              private reservasService: ReservasService,
              private reservarService: ReservarService,
              private utilsService: UtilsService,
              private estacionamentosService: EstacionamentosService) { }

  ngOnInit() {

    const id = +this.activatedRoute.snapshot.params.id;
    if (id){
      this.findById(id);
    }

  }

  findById(id){
    this.loading = true;
    this.reservasService
    .visualizarResumo(id)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (dados) => {
        this.EstacionamentoId = dados.EstacionamentoId;
        this.NomeEstacionamento = dados.NomeEstacionamento;
        this.DataEntrada = this.utilsService.formataData(dados.DataEntrada.toLocaleString(),false);
        this.HoraEntrada = dados.HoraEntrada;
        this.DataSaida = this.utilsService.formataData(dados.DataSaida.toLocaleString(),false);
        this.HoraSaida = dados.HoraSaida;
        this.DescricaoFormaPagamento = dados.DescricaoFormaPagamento;
        this.Valor = dados.Valor;
        this.STATUS = dados.STATUS;
        this.observacao = dados.Observacao;
        console.log(dados);

        console.log(`${dados.DataEntrada.toLocaleString()}T${this.HoraEntrada}`);
        //this.Reservar.DataEntrada = `${dados.DataEntrada.toLocaleString()}T${this.HoraEntrada}`;
        //this.Reservar.DataSaida = `${dados.DataSaida.toLocaleString()}T${this.HoraSaida}`;
        //this.findEstacionamentoById(this.EstacionamentoId);
        //this.ReservarM.Estacionamento = this.Estacionamento;
        //  console.log((this.ReservarM as Reservar).Valor);
        //this.getCalculoValores(this.Reservar);

        this.ReservarM = new ReservarClass();
        this.ReservarM.DataEntrada = `${dados.DataEntrada.toLocaleString()}T${this.HoraEntrada}`;
        this.ReservarM.DataSaida = `${dados.DataSaida.toLocaleString()}T${this.HoraSaida}`;
        this.findEstacionamentoById(this.EstacionamentoId);
        //this.ReservarM.Estacionamento = this.Estacionamento;
        //console.log(this.ReservarM);
        //console.log(this.EstacionamentoId);
        //console.log(this.Estacionamento);
      },
      async (error) => {
        console.log("deu errado viu");
        console.log(error.error);
      }
    );

  }

  findEstacionamentoById(id : number){
    console.log("entro na lista de reserva");
    this.loading = true;
    this.estacionamentosService
    .getEstacionamento(id)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (dados) => {
          this.Estacionamento = dados;
          //console.log(this.Estacionamento);
          this.ReservarM.Estacionamento = dados;
          this.getCalculoValores(this.ReservarM);
      },
      async (error) => {
        console.log(error.error);
      }
    );
  }


  getCalculoValores(reservar : Reservar){
    this.loading = true;
    this.reservarService
    .getCalculaVerificaValores(reservar)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (verificacao) => {
        this.calculoValores = JSON.parse(verificacao.Verificacao) as VerificacaoProps;
        if (this.Valor <= 0 ){
          this.Valor = parseFloat(parseFloat(this.calculoValores.valor).toFixed(2));
        }
        this.tempoDesc = this.calculoValores.tempoDesc;
        console.log(verificacao);
      },
      async (error) => {
        //console.log("deu erro aqui mesmo esse cfarlahooooopoolio")
        //console.log(error.error);
      }
    );
  }


  CancelarReserva(){

  }

}

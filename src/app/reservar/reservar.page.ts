import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { EstacionamentosService } from '../api/estacionamentos/estacionamentos.service';
import { Estacionamento } from '../model/estacionamentos.model';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MetodosPagamento } from '../model/metodospagamento.model';
import { MetodospagamentoService } from '../api/metodospagamento/metodospagamento.service';
import { ReservarService } from '../api/reservar/reservar.service';
import { VerificacaoProps } from '../model/reservar.model';
import { MensagemService } from '../services/mensagem/mensagem.service';
import { UtilsService } from '../utils/utils.service';
import { ModalController, NavController } from '@ionic/angular';
import { InformacoesReservaComponent } from '../modal/informacoes-reserva/informacoes-reserva.component';
import { User } from '../model/login.model';
import { FormaPagamento } from '../model/formapagamento.model';
import { FormaPagamentoService } from '../api/formapagamento/forma-pagamento.service';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
})
export class ReservarPage implements OnInit {

  loading : boolean = false;
  form: FormGroup;
  estacionamento : Estacionamento;
  estacionamentos : Estacionamento[];
  metodosPagamento : MetodosPagamento[];
  formaPagamentos : FormaPagamento[];
  calculoValores : VerificacaoProps;
  liberaPagamento : string;
  valorPagamento : string;
  tempoDescricao : string;
  precoHora: number;
  precoLivre: number;
  isToggleBtnChecked : any;
  mostraMetodosPagamento: boolean = false;
  mostraPagarAntecipado: boolean = false;
  observacao : string;
  Cadastro : User;
  DataEntrada : string;
  DataSaida : string;
  FormaPagamento : FormaPagamento;

  constructor(private router: Router,
              private estacionamentosService: EstacionamentosService,
              private activatedRoute: ActivatedRoute,
              private metodospagamentoService: MetodospagamentoService,
              private reservarService: ReservarService,
              private mensagemService: MensagemService,
              private utilsService: UtilsService,
              private modalCtrl: ModalController,
              private FormaPagamentoService: FormaPagamentoService  ) { }

  ngOnInit() {
    this.Cadastro = this.utilsService.getUsuario('/home',true,"Não foi possível recuperar as informações de login, faça login para prosseguir com a reserva.");
    this.form = new FormGroup({
      Estacionamento: new FormControl(null, {validators: [Validators.required]}),
      MetodosPagamento: new FormControl(null, {validators: [Validators.required]}),
      FormaPagamento: new FormControl(null, {validators: [Validators.required]}),
      DataEntrada: new FormControl(null, {validators: [Validators.required]}),
      DataSaida: new FormControl(null, {validators: [Validators.required]}),
      Observacao: new FormControl(null, {validators: [Validators.required]}),
      CadastroId: new FormControl(null, {validators: [Validators.required]}),
      PagamentoAntecipado: new FormControl(null, {validators: [Validators.required]}),
      Valor: new FormControl(null, {validators: [Validators.required]}),
    });

    this.form.controls['CadastroId'].setValue(this.Cadastro.CadastroId);

    const id = +this.activatedRoute.snapshot.params.id;

    if (id) {
      this.findById(id);
    }
    this.listEstacionamento();
    this.listMetodosPagamento();
    this.listFormasPagamento();
  }

  ionViewWillEnter(): void {

  }

  onSubmit(){
    if (!this.validaData(true)){
      return;
    }

    this.getCalculoValores();
    this.openModal();

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
      (dados) => {
          this.estacionamento = dados;
          console.log("ao menos entrou");
          this.form.controls['Estacionamento'].setValue(dados);
          this.compareWithEstacionamento(dados,this.estacionamentos);
          this.precoHora = this.estacionamento.PrecoHora;
          this.precoLivre = this.estacionamento.PrecoLivre;
      },
      async (error) => {
        console.log("deu errado viu");
        console.log(error.error);
      }
    );

  }

  listEstacionamento(){
    console.log("entro na lista de reserva");
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
          this.estacionamentos = dados;
      },
      async (error) => {
        console.log(error.error);
      }
    );
  }

  listMetodosPagamento(){
    console.log("entro na lista de reserva");
    this.loading = true;
    this.metodospagamentoService
    .getMetodosPagamentos()
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (dados) => {
          this.metodosPagamento = dados;
      },
      async (error) => {
        console.log(error.error);
      }
    );
  }

  listFormasPagamento(){
    console.log("entro nas formas de pagamento");
    this.loading = true;
    this.FormaPagamentoService
    .getFormasPagamento()
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (dados) => {
          this.formaPagamentos = dados;
      },
      async (error) => {
        console.log(error.error);
      }
    );
  }

  getCalculoValores(){
    this.loading = true;
    this.reservarService
    .getCalculaVerificaValores(this.form.value)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (verificacao) => {
          this.calculoValores = JSON.parse(verificacao.Verificacao) as VerificacaoProps;
          this.liberaPagamento = this.calculoValores.liberaPagarAdiantado;
          this.valorPagamento = this.calculoValores.valor;
          this.tempoDescricao = this.calculoValores.tempoDesc;
          this.DataEntrada = this.utilsService.formataData(this.form.controls['DataEntrada'].value, true);
          this.DataSaida = this.utilsService.formataData(this.form.controls['DataSaida'].value, true);
          var valorPagamento = 0.00;
          if (this.valorPagamento !== undefined && this.valorPagamento){
            this.valorPagamento = parseFloat(this.valorPagamento).toFixed(2);
          }
          this.form.controls['Valor'].setValue(this.valorPagamento);
          console.log("Chegou a pegar os dados filho da puta");
          console.log(this.calculoValores.valor);

          //this.openModal();

          // console.log(this.calculoValores);

          // console.log("libera pagar" + this.calculoValores.liberaPagarAdiantado);
          // console.log("valor" + this.calculoValores.valor);
          // console.log("minutos" + this.calculoValores.minutos);

      },
      async (error) => {
        console.log("deu erro aqui mesmo esse cfarlahooooopoolio")
        console.log(error.error);
      }
    );
  }

  confirmaReserva(){
    this.loading = true;
    this.reservarService
    .confirmarReserva(this.form.value)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (Retorno) => {
        console.log(Retorno);
      },
      async (error) => {
        console.log("deu erro ao confirmar a reserva garai.")
        console.log(error.error);
      }
    );
  }

  compareWithEstacionamento(o1: Estacionamento, o2: Estacionamento | Estacionamento[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((u: Estacionamento) => u.EstacionamentoId === o1.EstacionamentoId);
    }

    return o1.EstacionamentoId === o2.EstacionamentoId;
  }

  compareWithMetodosPagamento(o1: MetodosPagamento, o2: MetodosPagamento | MetodosPagamento[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((u: MetodosPagamento) => u.CarteiraId === o1.CarteiraId);
    }

    return o1.CarteiraId === o2.CarteiraId;
  }

  compareWithFormaPagamento(o1: MetodosPagamento, o2: MetodosPagamento | MetodosPagamento[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((u: MetodosPagamento) => u.CarteiraId === o1.CarteiraId);
    }

    return o1.CarteiraId === o2.CarteiraId;
  }


  calculaValores(){
    console.log("entro calcula valores");
    if (this.validaData(false)){
      this.getCalculoValores();
      console.log("validou a data");
    } else {
      console.log("data invalida");
    }
  }


  validaData(mostraMensagem : boolean = false) : boolean {
    return true;

    var hoje = new Date(Date.now());
    var dataEntrada = this.form.controls['DataEntrada'].value;

    if (dataEntrada === undefined || !dataEntrada){
      if  (mostraMensagem){
        this.mensagemService.error("Preencha a data de entrada",()=>{});
      }
      return false;
    } else {
      dataEntrada = new Date(dataEntrada);

      if (dataEntrada < hoje){
        if (mostraMensagem){
          this.mensagemService.error("A data de entrada deve ser maior ou igual a hoje",()=>{});
        }
        return false;
      }
    }

    var dataSaida = this.form.controls['DataSaida'].value;

    if (dataSaida === undefined || !dataSaida){
      if (mostraMensagem){
        this.mensagemService.error("Preencha a data de saida",()=>{});
      }
      return;
    } else {
      dataSaida = new Date(dataSaida);
      if (dataEntrada > dataSaida){
        if (mostraMensagem){
          this.mensagemService.error("A data de entrada deve ser anterior a data de saida",()=>{});
        }
        return false;
      }
    }

    return true;
  }

  validaMetodoPagamento() : boolean {
    if (!this.onToggleBtnChange) {
      return true;
    }

    if (this.liberaPagamento !== undefined && this.liberaPagamento.trim() === 'S'){
      if (this.form.controls['MetodosPagamento'].value === undefined || !this.form.controls['MetodosPagamento'].value){
        this.mensagemService.error("Selecione um método de pagamento para o pagamento antecipado",()=>{});
        return false;
      }
    }
    return true;
  }

  async openModal() {
    if (!this.validaData(true)){
      return;
    }

    const { MetodosPagamento } = this.form.value;
    var descricaoPagamento = "No local";
    if (MetodosPagamento !== undefined && MetodosPagamento){
      descricaoPagamento = MetodosPagamento.Descricao;
    }


    const modal = await this.modalCtrl.create({
      component: InformacoesReservaComponent,
      componentProps:{
        descricaoEstacionamento: this.estacionamento.NomeEstacionamento,
        descricaoMetodoPagamento: descricaoPagamento,
        valorPagamento : parseFloat(this.valorPagamento).toFixed(2),
        tempoDescricao : this.tempoDescricao,
        precoReserva: this.precoHora,
        metodosPagamento: this.metodosPagamento,
        dataEntrada : this.DataEntrada,
        dataSaida : this.DataSaida
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      //this.message = `Hello, ${data}!`;
      console.log("aperto role de confirm.");
      this.form.controls['PagamentoAntecipado'].setValue(this.liberaPagamento)
      this.confirmaReserva();
    }

    console.log(data);


  }

  onToggleBtnChange(event): void {
    const isChecked = this.isToggleBtnChecked;
    if(!this.validaData(true)){
      this.isToggleBtnChecked = false;
      event.value = false;
      return;
    }

    this.getCalculoValores();
    if (this.liberaPagamento !== undefined && this.liberaPagamento.trim() == 'S'){
      this.mostraMetodosPagamento = isChecked;
    } else {
      this.mensagemService.error("Estacionamento não permite a realização de pagamentos antecipados",()=>{})
      this.isToggleBtnChecked = false;
      this.mostraMetodosPagamento = false;
    }

    // console.log(isChecked);
    // if (isChecked) {
    //   //this.mensagemService.success("Apertou aqui");
    //   //this.presentAlert();
    // }
  }
}

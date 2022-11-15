import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, NgControlStatusGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Estacionamento } from 'src/app/model/estacionamentos.model';
import { FormaPagamento } from 'src/app/model/formapagamento.model';
import { User } from 'src/app/model/login.model';
import { MetodosPagamento } from 'src/app/model/metodospagamento.model';
import { VerificacaoProps } from 'src/app/model/reservar.model';
import { EstacionamentosService } from 'src/app/services/estacionamentos/estacionamentos.service';
import { MensagemService } from 'src/app/services/mensagem/mensagem.service';
import { MetodospagamentoService } from 'src/app/services/metodospagamento/metodospagamento.service';
import { ReservarService } from 'src/app/services/reservar/reservar.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FormaPagamentoService } from 'src/app/services/formapagamento/forma-pagamento.service';
import { finalize } from 'rxjs/operators';
import { InformacoesReservaComponent } from 'src/app/component/informacoes-reserva/informacoes-reserva.component';
import { DiasatendimentoService } from 'src/app/services/diasatendimento/diasatendimento.service';
import { DiasAtendimento } from 'src/app/model/diasatendimento.model';
import { ThrowStmt } from '@angular/compiler';
import { ElementArrayFinder } from 'protractor';

@Component({
  selector: 'app-reserva-cadastro',
  templateUrl: './reserva-cadastro.page.html',
  styleUrls: ['./reserva-cadastro.page.scss'],
})

export class ReservaCadastroPage implements OnInit {

  loading : boolean = false;
  form: FormGroup;
  estacionamento : Estacionamento;
  estacionamentos : Estacionamento[];
  estacionamentosDisponíveis : Estacionamento[];
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
  mostraFormasPagamento: boolean = false;
  mostraPagarAntecipado: boolean = false;
  observacao : string;
  Cadastro : User;
  DataEntrada : string;
  DataSaida : string;
  FormaPagamento : FormaPagamento;
  DiasAtendimento : DiasAtendimento[];
  MetodoPagamento : MetodosPagamento;
  TipoChavePix : string;
  ChavePix: string;
  VagasReserva : string;
  PagamentoViaPix: boolean = false;
  estacionamentosDisponiveis : Estacionamento[];

  constructor(private router: Router,
              private estacionamentosService: EstacionamentosService,
              private activatedRoute: ActivatedRoute,
              private metodospagamentoService: MetodospagamentoService,
              private reservarService: ReservarService,
              private mensagemService: MensagemService,
              private utilsService: UtilsService,
              private modalCtrl: ModalController,
              private FormaPagamentoService: FormaPagamentoService,
              private diasatendimentoService: DiasatendimentoService) { }

  ngOnInit() {
    this.Cadastro = this.utilsService.getUsuario('/home',true,"Não foi possível recuperar as informações de login, faça login para prosseguir com a reserva.");
    this.form = new FormGroup({
      Estacionamento: new FormControl(null, {validators: [Validators.required]}),
      MetodosPagamento: new FormControl(null),
      FormaPagamento: new FormControl(null),
      DataEntrada: new FormControl(null, {validators: [Validators.required]}),
      DataSaida: new FormControl(null, {validators: [Validators.required]}),
      Observacao: new FormControl(null),
      CadastroId: new FormControl(null, {validators: [Validators.required]}),
      PagamentoAntecipado: new FormControl(null),
      Valor: new FormControl(null),
    });

  }

  ionViewWillEnter(): void {
    this.Cadastro = this.utilsService.getUsuario('/home',true,"Não foi possível recuperar as informações de login, faça login para prosseguir com a reserva.");

    this.form.controls['CadastroId'].setValue(this.Cadastro.CadastroId);

    const id = +this.activatedRoute.snapshot.params.id;

    if (id) {
      this.findById(id);
    }

    this.listEstacionamento();
    this.listMetodosPagamento(this.Cadastro.CadastroId);
    this.listFormasPagamento();
    this.filtroPreciso();
    //this.listDiasAtendimento();
  }

  onSubmit(){
    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.estacionamento = this.form.controls['Estacionamento'].value;

    if (this.estacionamento.EstacionamentoId !== 3) {
      this.mensagemService.error("Estacionamento não atende nesse dia",()=>{});
      return
    }

    this.listDiasAtendimento(this.estacionamento.EstacionamentoId);

    if (!this.validaData(true)){
      return;
    }

    if (this.estacionamentosDisponiveis == undefined || this.estacionamentosDisponiveis.length <= 0){
      this.mensagemService.error("Estacionamento não esta disponível nesse momento para a reserva",()=>{});
      return
    }

    var entrada = this.form.controls['DataEntrada'].value;
    var saida = this.form.controls['DataSaida'].value;

    console.log(entrada);
    console.log(saida);

    if (!this.utilsService.validaDiasAtendimento(this.DiasAtendimento,true,entrada,saida)){
      return;
    }



    this.getCalculoValores();
    //this.openModal();
  }

  findById(id, somenteRecuperarObjeto : boolean = false){
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
          if (!somenteRecuperarObjeto){
            this.compareWithEstacionamento(dados,this.estacionamentos);
            this.form.controls['Estacionamento'].setValue(dados);
          }
          console.log("ao menos entrou");
          //this.form.controls['Estacionamento'].setValue(dados);
          //this.compareWithEstacionamento(dados,this.estacionamentos);
          this.precoHora = this.estacionamento.PrecoHora;
          this.precoLivre = this.estacionamento.PrecoLivre;
          this.VagasReserva = dados.VagasReserva;
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

  listEstacionamentosDisponíveis(){
    console.log("entro na lista de reserva");
    this.loading = true;
    this.estacionamentosService
    .getFiltroPreciso()
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe(
      (dados) => {
          console.log(dados);
          //this.estacionamentos = dados;

          // @ts-ignore
          if (dados == 'Não existem dados para retornar'){
            this.mensagemService.error("Não existem estacionamentos disponíveis no momento para a locação.",()=>{});
            //this.estacionamentos = null;
            //console.log("deu errado aqui");
          } else {
            //this.mensagemService.success("Filtro preciso ativado, somente estacionamentos disponívels no momento para locação.");
            this.estacionamentosDisponíveis = dados;
            //console.log(dados);
            this.estacionamentos.forEach(x => {
              x.UrlFoto = this.utilsService.formataUrlFoto(x.UrlFoto);
            });
          }
      },
      async (error) => {
        console.log(error.error);
      }
    );
  }

  listMetodosPagamento(id: number){
    console.log("entro na lista de reserva");
    this.loading = true;
    this.metodospagamentoService
    .getMetodosPagamentosByCadastro(id)
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
        var entrada = this.form.controls['DataEntrada'].value;
        var saida = this.form.controls['DataSaida'].value;

        // aqui era a validação.
        // if (!this.utilsService.validaDiasAtendimento(dados,true,entrada,saida)) {
        //   //this.router.navigate(['/reserva-lista']);
        // };

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
          this.observacao = this.form.controls['Observacao'].value;
          var valorPagamento = 0.00;
          if (this.valorPagamento !== undefined && this.valorPagamento){
            this.valorPagamento = parseFloat(this.valorPagamento).toFixed(2);
          }
          this.form.controls['Valor'].setValue(this.valorPagamento);
          //console.log("Chegou a pegar os dados filho da puta");
          //console.log(this.calculoValores.valor);
          var prosseguirReserva = true;

          if (this.liberaPagamento.trim() == 'S' && this.isToggleBtnChecked){
            this.FormaPagamento = this.form.controls['FormaPagamento'].value;
            if (this.FormaPagamento == undefined || !this.FormaPagamento){
              this.mensagemService.error("Selecione uma forma de pagamento para o pagamento antecipado.",()=>{});
              prosseguirReserva = false;
            } else if (this.FormaPagamento.FormaPagamentoId == 3 || this.FormaPagamento.FormaPagamentoId == 4){
              this.MetodoPagamento = this.form.controls['MetodosPagamento'].value;
              if (this.MetodoPagamento == undefined || !this.MetodoPagamento){
                this.mensagemService.error("Selecione um método de pagamento para o pagamento antecipado.",()=>{});
                prosseguirReserva = false;
              }
            }
          }

          if (prosseguirReserva){
            this.openModal();
          }
      },
      async (error) => {
        //console.log("deu erro aqui mesmo esse cfarlahooooopoolio")
        //console.log(error.error);
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
      (dados) => {
        console.log(dados);
        if (dados.dados == 'Reserva confirmada com sucesso.'){
          this.mensagemService.success(dados.dados);
          this.router.navigate(['estacionamento-lista']);
        } else {
          this.mensagemService.error(dados.dados,()=>{});
        }
      },
      async (error) => {
        this.mensagemService.error("Erro ao realizar a reserva, por favor tente novamente.",()=>{});
        this.router.navigate(['/reserva-cadastro']);
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

  compareWithFormaPagamento(o1: FormaPagamento, o2: FormaPagamento | FormaPagamento[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((u: FormaPagamento) => u.FormaPagamentoId === o1.FormaPagamentoId);
    }

    return o1.FormaPagamentoId === o2.FormaPagamentoId;
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
    //console.log("COmeçou a validar a data");
    //return true;

    var hoje = new Date(Date.now());
    var dataEntrada = this.form.controls['DataEntrada'].value;

    if (dataEntrada === undefined || !dataEntrada){
      if  (mostraMensagem){
        this.mensagemService.error("Preencha a data de entrada",()=>{});
      }
      return false;
    } else {
      dataEntrada = new Date(dataEntrada);
      ///console.log(dataEntrada);
      //console.log(hoje);

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



    var diaEntra = new Date(dataEntrada);
    var diaSaida = new Date(dataSaida);

    if (diaEntra.getDay() != diaSaida.getDay()) {
      this.mensagemService.error("A reserva somente pode ser realizada dentro do mesmo dia.",()=>{});
      return false;
    }


    //console.log(dataEntrada);
    //console.log(dataSaida);

    //return false;
    //return this.utilsService.validaDiasAtendimento(this.DiasAtendimento,true);

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
    // if (!this.validaData(true)){
    //   return;
    // }

    const { MetodosPagamento, FormaPagamento } = this.form.value;
    var descricaoPagamento = "No local";
    var PagamentoPix = "";
    if (MetodosPagamento !== undefined && MetodosPagamento){
      descricaoPagamento = MetodosPagamento.Descricao;

    }

    if (FormaPagamento !== undefined && FormaPagamento){

      console.log(FormaPagamento);

      PagamentoPix = FormaPagamento.FormaPagamentoId == 1 ? "Pix" : "";
      console.log("Pegou o pagamento sim");
      console.log(FormaPagamento);
    }

    var pagapix = (this.form.controls['FormaPagamento'].value) as FormaPagamento;


    // if (pagapix !== undefined && pagapix){
    //   PagamentoPix = 'S';
    // } else {
    //   PagamentoPix = undefined;
    // }

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
        dataSaida : this.DataSaida,
        pagamentoPix: PagamentoPix,
        observacao: this.observacao,
        tipoChavePix : this.estacionamento.TipoChavePix,
        chavePix : this.estacionamento.ChavePix
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      //this.message = `Hello, ${data}!`;
      //console.log("aperto role de confirm.");
      //this.form.controls['PagamentoAntecipado'].setValue(this.liberaPagamento)
      this.confirmaReserva();
    }

    console.log(data);


  }

  onToggleBtnChange(event): void {
    const isChecked = this.isToggleBtnChecked;
    this.isToggleBtnChecked = isChecked;
    this.mostraMetodosPagamento = this.isToggleBtnChecked;
    this.mostraFormasPagamento = this.isToggleBtnChecked;

    if (this.mostraMetodosPagamento){
      this.mostraMetodosPagamento = this.metodosPagamento.length > 0;
    }

    if (this.mostraFormasPagamento){
      this.mostraFormasPagamento = this.formaPagamentos.length > 0;
    }

    if (!this.isToggleBtnChecked){
      this.form.controls['MetodosPagamento'].setValue(null);
      this.form.controls['FormaPagamento'].setValue(null);
    }

    // if(!this.validaData(true)){
    //   this.isToggleBtnChecked = false;
    //   event.value = false;
    //   return;
    // }

    // this.getCalculoValores();
    // if (this.liberaPagamento !== undefined && this.liberaPagamento.trim() == 'S'){
    //   this.mostraMetodosPagamento = isChecked;
    // } else {
    //   this.mensagemService.error("Estacionamento não permite a realização de pagamentos antecipados",()=>{})
    //   this.isToggleBtnChecked = false;
    //   this.mostraMetodosPagamento = false;
    // }

  }

  atualizarVagasDisponiveis(){
    const id = +this.activatedRoute.snapshot.params.id;
    var idSelecionado = (this.form.controls['Estacionamento'].value as Estacionamento).EstacionamentoId;
    //console.log(idSelecionado);
    //var vagasdisponiveisSelecionado = (this.form.controls['Estacionamento'].value as Estacionamento).VagasReserva;
    if (idSelecionado) {
        this.findById(idSelecionado,true);
    }
    console.log("ionchange garai");

    this.listDiasAtendimento(idSelecionado);
  }

  validaPagamentoAntecipado() : boolean {
    console.log("validando pagamento antecipado");

    if (!this.isToggleBtnChecked){
      return true;
    }

    var formaPagamentoAtual =  (this.form.controls['FormaPagamento'].value) as FormaPagamento;
    var metodoPagamentoAtual = (this.form.controls['MetodosPagamento'].value) as FormaPagamento;

    if (formaPagamentoAtual == undefined && metodoPagamentoAtual == undefined){
      this.mensagemService.error("Para pagamentos antecipados preencha uma forma de pagamento ou médetodo de pagamento desejado.",()=>{});
      return false;
    } else if(formaPagamentoAtual.FormaPagamentoId == 1 && metodoPagamentoAtual !== undefined) {
      this.mensagemService.error("Forma de pagamento Pix não é possível selecionar método de pagamento",()=>{});
      return false;
    } else if (metodoPagamentoAtual !== undefined && formaPagamentoAtual !== undefined){
      this.mensagemService.error("Somente é possível faz",()=>{});
    }


    return true;
  }

  alterouFormaPagamento(){
    var formaPagamentoAtual =  (this.form.controls['FormaPagamento'].value) as FormaPagamento;
    if (formaPagamentoAtual == undefined) return;
    if (formaPagamentoAtual.FormaPagamentoId == 1) {
      this.mostraMetodosPagamento = false;
      this.form.controls['MetodosPagamento'].setValue(null);
    } else {
      this.mostraMetodosPagamento = true;
    }

    console.log("Alterou forma de pagagamento");
  }

  alterouMetodopagamento(){
    //var metodoPagamentoAtual = (this.form.controls['MetodosPagamento'].value) as FormaPagamento;
    //if (metodoPagamentoAtual == undefined) return;
  }

  filtroPreciso(){
    this.loading = true;
      this.estacionamentosService
      .getFiltroPreciso()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (dados) => {
          console.log(dados);
          //this.estacionamentos = dados;

          // @ts-ignore
          if (dados == 'Não existem dados para retornar'){
            //this.mensagemService.error("Não existem estacionamentos disponíveis no momento para a locação.",()=>{});
            this.estacionamentosDisponiveis = null;
            console.log("deu errado aqui");
          } else {
            //this.mensagemService.success("Filtro preciso ativado, somente estacionamentos disponívels no momento para locação.");
            this.estacionamentosDisponiveis = dados;
            //console.log(dados);
            //this.estacionamentos.forEach(x => {
            //  x.UrlFoto = this.utilsService.formataUrlFoto(x.UrlFoto);
            //});
          }
        },
        async (error) => {
          console.log(error.error);
        }
      );
  }
}

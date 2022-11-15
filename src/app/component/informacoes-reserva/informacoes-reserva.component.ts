import { Component, Input, OnInit } from '@angular/core';
import { MetodosPagamento } from 'src/app/model/metodospagamento.model';
import { ModalController } from '@ionic/angular';
import { MetodospagamentoService } from 'src/app/services/metodospagamento/metodospagamento.service';
import { finalize } from 'rxjs/operators';
import { BrowserModule } from '@angular/platform-browser'
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-informacoes-reserva',
  templateUrl: './informacoes-reserva.component.html',
  styleUrls: ['./informacoes-reserva.component.scss'],
})
export class InformacoesReservaComponent implements OnInit {

  @Input() descricaoEstacionamento: string;
  @Input() descricaoMetodoPagamento: string;
  @Input() descricaoFormaPagamento: string;
  @Input() valorPagamento: number;
  @Input() tempoDescricao: string;
  @Input() precoReserva: number;
  @Input() dataEntrada: string;
  @Input() dataSaida: string;
  @Input() pagamentoPix: string;
  @Input() observacao: string;
  @Input() tipoChavePix: string;
  @Input() chavePix: string;


  metodosPagamento: MetodosPagamento[];
  loading : boolean = false;

  constructor (private ModalCtrl: ModalController,
              private metodospagamentoService: MetodospagamentoService,
              private browserModule: BrowserModule,
              private actionSheetController: ActionSheetController) { }

  ngOnInit() {

  }

  ionViewWillEnter(): void {
    console.log(this.observacao);
    console.log(this.tipoChavePix);
    console.log(this.chavePix);
  }

  cancel(){
    return this.ModalCtrl.dismiss(null,'cancel');
  }

  confirm(){
    return this.ModalCtrl.dismiss(null,'confirm');
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

  async abrirListaAcao() {
    console.log("chegou a abrir");
    const actionSheet = await this.actionSheetController.create({
      header: 'Deseja confirmar essa reserva?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Sim',
        role: 'confirm',
        handler: () => {
          console.log("Apertou no confirme modal");
          return this.ModalCtrl.dismiss(null,'confirm');
        }
      },{
        text: 'Não',
        role: 'cancel',
        handler:() => {
          return this.ModalCtrl.dismiss(null,'cancel');
        }
      },]
    });
    await actionSheet.present();
  }

}

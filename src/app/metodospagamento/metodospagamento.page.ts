import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MensagemService } from '../services/mensagem/mensagem.service';
import { MetodospagamentoService } from '../api/metodospagamento/metodospagamento.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MetodosPagamento } from '../model/metodospagamento.model';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-metodospagamento',
  templateUrl: './metodospagamento.page.html',
  styleUrls: ['./metodospagamento.page.scss'],
})
export class MetodospagamentoPage implements OnInit {
  
  loading : boolean = false;
  metodosPagamentos : MetodosPagamento[];

  constructor(private router: Router,
              private mensagemService: MensagemService,
              private metodospagamentoService: MetodospagamentoService,
              private httpClient: HttpClient,
              private activatedRoute: ActivatedRoute,
              private actionSheetController: ActionSheetController ) { }

  ngOnInit() {
    const id = +this.activatedRoute.snapshot.params.id;

    if (id) {
      this.findById(id);
    }
  }


  findById(id){
    this.loading = true;
    this.metodospagamentoService
      .getMetodosPagamentos()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (metodosPagamentosApi) => {
          console.log(metodosPagamentosApi);
          if (metodosPagamentosApi) {
            this.metodosPagamentos = metodosPagamentosApi;
            this.metodosPagamentos.forEach(x => {
              if (x.TipoCartao.trim() == 'C'){
                x.TipoCartao = 'Crédito';
              } else if (x.TipoCartao.trim() == 'D'){
                x.TipoCartao = 'Débito';
              }
            });
          }          
        },
        () =>
          this.mensagemService.error(
            `Erro ao buscar estacionamentos`,
            () => this.findById(id)
          )
      );
  }

  async abrirListaAcao(metodo : MetodosPagamento) {
    console.log("chegou a abrir");
    const actionSheet = await this.actionSheetController.create({
      header: `${metodo.Descricao}`,
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Editar',
        role: 'destructive',
        icon: 'pencil-outline',
        handler: () => {
          this.router.navigate(['/metodo-pagamento-cadastro', metodo.CarteiraId]);
        }
      },{
        text: 'Excluir',
        role: 'destructive',
        icon: 'trash-outline',
        handler:() => {
          this.excluir(metodo.CarteiraId);
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  abrirTela(){
    this.router.navigate(['/metodo-pagamento-cadastro']);
  }

  excluir(id: number){
    this.loading = true;
    this.metodospagamentoService
      .getMetodoPagamentoUtilizado(id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (metodoPagamentoApi) => {
          this.metodospagamentoService.delete(metodoPagamentoApi.CarteiraId);
        },
        () =>
          this.mensagemService.error(
            `Método de Pagamento já está sendo utilizado`, ()=>{}
          )
      );
  }

}

import { User } from 'src/app/model/login.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MensagemService } from '../../../../services/mensagem/mensagem.service';
import { MetodospagamentoService } from 'src/app/services/metodospagamento/metodospagamento.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MetodosPagamento } from '../../../../model/metodospagamento.model';
import { ActionSheetController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-metodospagamento-lista',
  templateUrl: './metodospagamento-lista.page.html',
  styleUrls: ['./metodospagamento-lista.page.scss'],
})
export class MetodospagamentoListaPage implements OnInit {

  loading : boolean = false;
  metodosPagamentos : MetodosPagamento[];
  user : User;
  metodosPagamentoUtilizados: MetodosPagamento[];

  constructor(private router: Router,
              private mensagemService: MensagemService,
              private metodospagamentoService: MetodospagamentoService,
              private httpClient: HttpClient,
              private activatedRoute: ActivatedRoute,
              private actionSheetController: ActionSheetController,
              private utilsService: UtilsService ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    const id = +this.activatedRoute.snapshot.params.id;

    if (id) {
      this.findById(id);
      this.listMetodosPagamentoUtilizados(id);
    }

    this.user = this.utilsService.getUsuario("",false,"");
  }


  findById(id){
    this.loading = true;
    this.metodospagamentoService
      .getMetodosPagamentosByCadastro(id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (metodosPagamentosApi) => {
          console.log("Ver o que retornou");

          console.log(metodosPagamentosApi);
          // @ts-ignore
          if (metodosPagamentosApi.dados == 'Não existem dados para retornar'){
            this.metodosPagamentos = undefined;

          } else if (metodosPagamentosApi) {
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
    if (this.metodosPagamentoUtilizados !== undefined && this.metodosPagamentoUtilizados.length > 0 ){
      this.mensagemService.error("Não é possível excluir um método de pagamento que já tenha sido utilizado",()=>{});
      return;
    }
    this.loading = true;
    this.metodospagamentoService
      .delete(id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (Dados) => {
          if (Dados.dados == 'Método de pagamento excluido com sucesso.'){
            this.mensagemService.success(Dados.dados);
            this.findById(this.user.CadastroId);
          } else {
            this.mensagemService.error("Erro ao excluir método de pagamento, certifique-se de que já não tenha sido utilizado e tente novamente.",()=>{});
          }
        },
        () =>
          this.mensagemService.error(
            `Método de Pagamento já está sendo utilizado`, ()=>{}
          )
      );
  }

  deletar(id: number){
    this.loading = true;
    this.metodospagamentoService
      .delete(id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (Dados) => {
          if (Dados.dados == 'Método de pagamento excluido com sucesso.'){
            this.mensagemService.success(Dados.dados);
            const id = +this.activatedRoute.snapshot.params.id;
            this.findById(id);
            this.router.navigate(['/metodospagamento-lista', this.user.CadastroId]);
          } else {
            this.mensagemService.error(Dados.dados,()=>{});
          }
        },
        () =>
          this.mensagemService.error(
            `Método de Pagamento já está sendo utilizado`, ()=>{}
          )
      );
  }

  listMetodosPagamentoUtilizados(id: number){
    this.loading = true;
    this.metodospagamentoService
      .getMetodoPagamentoUtilizado(id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (metodospagamentoutilizados) => {
          // @ts-ignore
          if (metodospagamentoutilizados.dados == 'Não existem dados para retornar'){

          } else {
            this.metodosPagamentoUtilizados = metodospagamentoutilizados;
          }

        },
        () =>
          this.mensagemService.error(
            `Erro ao buscar estacionamentos`,
            () => {}
          )
      );
  }

}

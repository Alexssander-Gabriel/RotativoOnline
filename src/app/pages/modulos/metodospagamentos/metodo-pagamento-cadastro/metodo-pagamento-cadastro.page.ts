import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { MetodospagamentoService } from 'src/app/services/metodospagamento/metodospagamento.service';
import { MensagemService } from '../../../../services/mensagem/mensagem.service';
import { User } from '../../../../model/login.model';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-metodo-pagamento-cadastro',
  templateUrl: './metodo-pagamento-cadastro.page.html',
  styleUrls: ['./metodo-pagamento-cadastro.page.scss'],
})
export class MetodoPagamentoCadastroPage implements OnInit {

  form: FormGroup;
  loading : boolean = false;
  user : User;

  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private metodospagamentoService: MetodospagamentoService,
              private mensagemService: MensagemService,
              private router: Router,
              private utilsService: UtilsService ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Descricao: ['', [Validators.required, Validators.minLength(1)]],
      NumeroCartao: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(19)]],
      NomeCartao: ['', [Validators.required, Validators.minLength(1)]],
      CodigoSegurancaoCartao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      TipoCartao: ['', [Validators.required]],
      CadastroId: [''],
      CarteiraId: ['']
    });

    this.user = JSON.parse(sessionStorage.getItem('usuarioLogado'));

    const id = +this.activatedRoute.snapshot.params.id;

    if (id) {
      this.findById(id);
    }

    if (this.user !== undefined && this.user){
      this.form.controls['CadastroId'].setValue(this.user.CadastroId);
    } else {
      this.mensagemService.error("Erro ao coletar informações de login, por favor faça login novamente",()=>{});
      this.router.navigate(['/sign-in']);
    }

  }

  onSubmit(){
    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    var tipoCartao = this.form.controls['TipoCartao'].value;
    if (tipoCartao == undefined || !tipoCartao){
      this.mensagemService.error("Preencha o campo Tipo Cartão.",()=>{});
      return;
    }

    const id = +this.activatedRoute.snapshot.params.id;

    if (id) {
      this.atualizarMetodoPagamento();
    } else {
      this.salvar();
    }

  }


  findById(id){
    this.loading = true;
    this.metodospagamentoService
      .getMetodoPagamento(id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (metodo) => {
          if (metodo) {
            console.log("chegou aqui no find by id");
            this.form.patchValue({
              ...metodo,
            });
          }
        },
        () =>
          this.mensagemService.error(
            `Erro ao buscar o cadastro com codigo ${id}`,
            () => this.findById(id)
          )
      );
  }

  salvar() {
    this.loading = true;
    const { Descricao } = this.form.value;

    //this.loading = true;

    this.metodospagamentoService
      .save(this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.router.navigate(['/metodospagamento-lista', this.user.CadastroId]);
          //setTimeout(() => {
            this.router.navigate(['/metodospagamento-lista', this.user.CadastroId]);
          //}, 3000)
        })
      )
      .subscribe(
        (dados) => {
          this.mensagemService.success(`Método de pagamento ${Descricao} cadastrado com sucesso!`);
          //this.logarUsuario();


        },
        (dados) => {
          console.log(dados);
          var erro =  dados.error.text;
          this.mensagemService.error(`Erro ao cadastrar método de pagamento : ${Descricao}, Erro: ${erro}`, () =>{}
          );
        }
      );
  }


  atualizarMetodoPagamento() {
    this.loading = true;
    const { Descricao } = this.form.value;

    //this.loading = true;

    this.metodospagamentoService
      .atualizarMetodoPagamento(this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.router.navigate(['/metodospagamento-lista', this.user.CadastroId]);
          //setTimeout(() => {
            this.router.navigate(['/metodospagamento-lista', this.user.CadastroId]);
          //}, 3000)
        })
      )
      .subscribe(
        (dados) => {
          console.log(dados);
           if (dados.dados == 'Login atualizado com sucesso.'){
            this.mensagemService.success(dados.dados);
           } else {
            this.mensagemService.error("Erro ao atualizar método de pagamento, por favor tente novamente",()=>{});
           }
          // this.mensagemService.success(`Método de pagamento ${Descricao} cadastrado com sucesso!`);
          // //this.logarUsuario();
        },
        (dados) => {
          console.log(dados);
          var erro =  dados.error.text;
          this.mensagemService.error(`Erro ao cadastrar método de pagamento : ${Descricao}, Erro: ${erro}`, () =>{}
          );
        }
      );
  }

}

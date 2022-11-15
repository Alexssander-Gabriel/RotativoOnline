import { Component, isDevMode, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgControlStatusGroup, Validators } from '@angular/forms';
import { Cidade, Cidades } from 'src/app/model/cidade.model';
import { CidadeService } from 'src/app/services/cidade/cidade.service';
import { finalize, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/services/login/login.service';
import { MensagemService } from 'src/app/services/mensagem/mensagem.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/login.model';
import { Login } from 'src/app/model/login.model';
import { Cadastro } from 'src/app/model/cadastro.model';
import { CadastroService } from 'src/app/services/cadastro/cadastro.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { noUndefined } from '@angular/compiler/src/util';
import { configFromSession } from '@ionic/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form: FormGroup;
  cidade : Cidade;
  cidades : Cidades[];
  login: Login[];
  loading : boolean = false;
  cadastros : Cadastro[];
  users : User[];
  cadastroAtual : Cadastro;
  isToggleBtnChecked: boolean;

  constructor(
           private cidadeService : CidadeService,
           private loginService :LoginService,
           private cadastroService: CadastroService,
           private mensagemService : MensagemService,
           private UtilsService: UtilsService,
           private router : Router,
           public httpCliente : HttpClient
   ) {
    this.initForm();
  }

  ngOnInit() {
    this.listCadastros();
    this.listCidades();
    this.listLogins();
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required]}),
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
      nome: new FormControl(null, {validators: [Validators.required]}),
      numeroTelefone: new FormControl(null, {validators: [Validators.required]}),
      cpf: new FormControl(null, {validators: [Validators.required]}),
      numeroCep: new FormControl(null, {validators: [Validators.required]}),
      cidade: new FormControl(null, {validators: [Validators.required]}),
      numeroEndereco: new FormControl(null, {validators: [Validators.required]}),
      endereco: new FormControl(null, {validators: [Validators.required]}),
      bairro: new FormControl(null, {validators: [Validators.required]}),
      complemento: new FormControl(null, {validators: [Validators.required]})
    });
  }

  ionViewWillEnter(): void {
  }

  onSubmit() {
    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.validaCadastro(this.cadastros,true) && this.validaLogin(this.login, true)){
      this.salvar();
    }

  }

  listCidades() {
    this.loading = true;
    this.cidadeService
      .getCidades()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (cidades) => {
          this.cidade = cidades;
          this.cidades = this.cidade.dados;
        },
        async (error) => {
        }
      );
  }

  listCadastros() {
    this.loading = true;
    this.cadastroService
      .getCadastros()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (dados) => {
          this.cadastros = dados;
        },
        async (error) => {
        }
      );
  }

  compareWithCidade(o1: Cidades, o2: Cidades | Cidades[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((u: Cidades) => u.CidadeId === o1.CidadeId);
    }

    return o1.CidadeId === o2.CidadeId;
  }

  buscaCep(){
    const cepValue = this.form.controls['numeroCep'].value;
    const isValid = this.form.controls['numeroCep'].valid;
    if (isValid){
      try {
        this.httpCliente.get(`https://viacep.com.br/ws/${cepValue}/json/`)
        .subscribe(data => {
          this.insererValoresEndereco(data);
        })
      } catch (error) {

      }
    }
  }

  insererValoresEndereco(dados){
    this.form.controls['endereco'].setValue(dados.logradouro);
    this.form.controls['bairro'].setValue(dados.bairro);

    if (dados.uf !== undefined && dados.uf.trim() != '') {
      var cidadeCep = this.cidades.find((item)=>{
        return item.Estado.toLowerCase().trim() == dados.uf.toLowerCase().trim()
            && item.NomeCidade.toLowerCase().trim() == dados.localidade.toLowerCase().trim();
      });
      if (cidadeCep){
        this.form.controls['cidade'].setValue(cidadeCep);
      }
    }
  }


  salvar() {
    this.loading = true;
    const { name, password } = this.form.value;
    this.loginService
      .save(this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (dados) => {
          this.mensagemService.success(`Usuário ${name} cadastrado com sucesso!`);
          this.router.navigate(['/welcome/sign-in']);
        },
        (dados) => {
          console.log(dados);
          var erro =  dados.error.text;
          this.mensagemService.error(`Erro ao cadastrar usuario : ${name}, Erro: ${erro}`, () =>{}
          );
        }
      );
  }

  listLogins() {
    this.loginService
      .getLogins()
      .pipe(
        finalize(() => {
        })
      )
      .subscribe(
        (dadosLogin) => {
          this.login = dadosLogin;
        },
        async (error) => {}
      );
  }

  logarUsuario(){
    console.log("esta logando");
    this.listLogins();
    const { name, password } = this.form.value;

    var existsUser = this.login.find((item) => {
      return item.NomeUsuario.toLowerCase() === name.toLowerCase().trim() && item.Senha == password.trim();
    });

    if (existsUser) {
      const usuarioLogado = new User();
      usuarioLogado.CadastroId = existsUser.CadastroId;
      usuarioLogado.Email  = existsUser.Email;
      usuarioLogado.LoginId = existsUser.LoginId;
      usuarioLogado.NomeUsuario = existsUser.NomeUsuario;
      usuarioLogado.PermissaoId = existsUser.PermissaoId;
      usuarioLogado.TokenEmail = existsUser.TokenEmail;

      sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioLogado));
      console.log('Usuário logado', JSON.parse(sessionStorage.getItem('usuarioLogado')));
      this.router.navigate(['/home']);
    }
  }

  convertFormToLogin() : Cadastro{
     this.cadastroAtual.Cpf = this.form.controls['cpf'].value;

     return this.cadastroAtual;
  }


  validaCadastro(cadastros : Cadastro[], mostraMensagem : boolean = false) : boolean{

    if ((cadastros !== undefined && cadastros.length > 0)  && (this.form.controls['cpf'].value !== undefined)){

      var existsCadastroCpf = cadastros.find((item)=> item.Cpf.trim() == this.form.controls['cpf'].value)

      if (existsCadastroCpf !== undefined && existsCadastroCpf){
        if (mostraMensagem){
          this.mensagemService.error("Já existe um cadastro com o mesmo cpf informado.",()=>{});
        }
        return false;
      }
    }

    return true;
  }

  validaLogin(logins : Login[], mostraMensagem : boolean = true){
    if ((logins !== undefined && logins.length > 0) && (this.form.controls['email'].value !== undefined)){

      var existsLoginEmail = logins.find((item)=> item.Email.trim() == this.form.controls['email'].value);

      if (existsLoginEmail !== undefined && existsLoginEmail){
        if (mostraMensagem){
          this.mensagemService.error("Já eixste um cadastro com mesmo email",()=>{});
        }
        return false;
      }
    }

    if ((logins !== undefined && logins.length > 0) && (this.form.controls['name'].value !== undefined)){

      var existsLoginEmail = logins.find((item)=> item.NomeUsuario.trim() == this.form.controls['name'].value);

      if (existsLoginEmail !== undefined && existsLoginEmail){
        if (mostraMensagem){
          this.mensagemService.error("Já existem um cadastro com mesmo nome de usuário",()=>{});
        }
        return false;
      }
    }

    return true
  }

  onToggleBtnChange(event): void {
    const isChecked = this.isToggleBtnChecked;
    this.isToggleBtnChecked = isChecked;
  }

}

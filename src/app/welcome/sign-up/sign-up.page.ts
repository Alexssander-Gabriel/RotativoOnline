import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cidade, Cidades } from 'src/app/model/cidade.model';
import { CidadeService } from 'src/app/api/cidade/cidade.service';
import { finalize, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/api/login/login.service';
import { MensagemService } from 'src/app/services/mensagem/mensagem.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/login.model';
import { Login } from 'src/app/model/login.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form: FormGroup;
  cidade : Cidade;
  cidades : Cidades[];
  login: Login;
  loading : boolean = false;

  constructor(
           private cidadeService : CidadeService,
           private loginService :LoginService,
           private mensagemService : MensagemService,
           private router : Router,
           public httpCliente : HttpClient
   ) { 
    this.initForm();
  }

  ngOnInit() {
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
    this.listCidades();
  }

  onSubmit() {
    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }    
    this.salvar();
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
    //console.log('Chegou aqui no cep');
    const cepValue = this.form.controls['numeroCep'].value;
    const isValid = this.form.controls['numeroCep'].valid;
    if (isValid){
      //console.log('VALIDO');
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
    //console.log(this.form.controls['cidade'].value);
  }


  salvar() {
    this.loading = true;
    const { name, password } = this.form.value;
  
    //this.loading = true;
  
    this.loginService
      .save(this.form.value)
      //.save(dados)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (dados) => {
          this.mensagemService.success(`Usuário ${name} cadastrado com sucesso!`);
          //this.logarUsuario();
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
        (logins) => {
          this.login = logins;
        },
        async (error) => {}
      );
  }

  logarUsuario(){
    console.log("esta logando");
    this.listLogins();
    const { name, password } = this.form.value;

    var existsUser = this.login.dados.find((item) => {
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
}

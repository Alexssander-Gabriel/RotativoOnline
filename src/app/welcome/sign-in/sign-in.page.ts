import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Login, User } from 'src/app/model/login.model';
import { LoginService } from 'src/app/api/login/login.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MensagemService } from 'src/app/services/mensagem/mensagem.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  form: FormGroup;
  login: Login;
  loading : boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private mensagemService : MensagemService
  ) {
    this.initForm();
    this.login = null;
  }

  ngOnInit() {
  }

  initForm() {
    this.form = new FormGroup({
      login: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      senha: new FormControl(null, { validators: [Validators.required, Validators.minLength(8)] }),
    });
  }

  ionViewWillEnter(): void {
    this.listLogins();
  }

  onSubmit() {
    if (!this.form.valid) {
      console.log("formulario não é valido");
      this.form.markAllAsTouched();
      return;
    }
    var usuario = this.form.controls['login'].value;
    var senha = this.form.controls['senha'].value;

    var existsUser = this.login.dados.find((item) => {
      return item.NomeUsuario.toLowerCase() === usuario.toLowerCase().trim() && item.Senha == senha.trim() && item.PermissaoId == 4;
    });

    if (existsUser) {
      //console.log(existsUser);

      //var usuarioLogado  : User;
      const usuarioLogado = new User();

      //console.log(usuarioLogado);
      usuarioLogado.CadastroId = existsUser.CadastroId;
      usuarioLogado.Email  = existsUser.Email;
      usuarioLogado.LoginId = existsUser.LoginId;
      usuarioLogado.NomeUsuario = existsUser.NomeUsuario;
      usuarioLogado.PermissaoId = existsUser.PermissaoId;
      usuarioLogado.TokenEmail = existsUser.TokenEmail;
      this.logarUsuario(usuarioLogado);
      this.mensagemService.success("Logado com sucesso!");
      this.router.navigate(['/home']);
    } else {
      this.mensagemService.error('Usuário ou Senha Incorreto(s)',()=>{});
      this.form.controls['login'].setValue('');
      this.form.controls['senha'].setValue('');
    }
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
          //console.log(this.login);
          //localStorage.setItem('listaProdutos',JSON.stringify(this.produtos));
        },
        async (error) => {
          /*
          this.produtos = JSON.parse(localStorage.getItem('listaProdutos')); 
          if(this.produtos.length == 0){
            await this.messageService.error('Não foi possível buscar itens do armazenamento interno.',()=>{});
           } else {
             await this.messageService.error('Não foi possível Carregar os itens do servidor! Carregado Itens do armazenamento Interno.',()=>{});
           } 
           */
        }
      );
  }

  logarUsuario(usuario : User){
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    console.log('Usuário logado', JSON.parse(sessionStorage.getItem('usuarioLogado')));
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Login, User } from 'src/app/model/login.model';
import { LoginService } from 'src/app/services/login/login.service';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MensagemService } from 'src/app/services/mensagem/mensagem.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  form: FormGroup;
  login: Login[];
  loading : boolean = false;

  constructor(private loginService: LoginService,
              private router: Router,
              private mensagemService : MensagemService,
              private utilsService: UtilsService) {
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
      this.form.markAllAsTouched();
      return;
    }
    var usuario = this.form.controls['login'].value;
    var senha = this.form.controls['senha'].value;

    var existsUser = this.login.find((item) => {
      return item.NomeUsuario.toLowerCase().trim() === usuario.toLowerCase().trim() && item.Senha == senha.trim() && item.PermissaoId == 4;
    });

    if (existsUser) {
      const usuarioLogado = new User();
      usuarioLogado.CadastroId = existsUser.CadastroId;
      usuarioLogado.Email  = existsUser.Email;
      usuarioLogado.LoginId = existsUser.LoginId;
      usuarioLogado.NomeUsuario = existsUser.NomeUsuario;
      usuarioLogado.PermissaoId = existsUser.PermissaoId;
      usuarioLogado.TokenEmail = existsUser.TokenEmail;

      this.utilsService.logarUsuario(usuarioLogado,'/estacionamento-lista',true);

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
        },
        async (error) => {
        }
      );
  }

}

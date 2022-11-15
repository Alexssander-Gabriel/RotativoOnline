import { FormaPagamento } from 'src/app/model/formapagamento.model';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Login, User } from '../../../../model/login.model';
import { MensagemService } from '../../../../services/mensagem/mensagem.service';
import { LoginService } from 'src/app/services/login/login.service';
import { finalize } from 'rxjs/operators';
import { testUserAgent } from '@ionic/core/dist/types/utils/platform';

@Component({
  selector: 'app-atualiza-login',
  templateUrl: './atualiza-login.page.html',
  styleUrls: ['./atualiza-login.page.scss'],
})

export class AtualizaLoginPage implements OnInit {
  form: FormGroup;
  loading : boolean = false;
  login : Login[];
  isToggleBtnChecked: boolean;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private mensagemService: MensagemService,
              private httpCliente : HttpClient,
              private activatedRoute: ActivatedRoute,
              private loginService: LoginService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      CadastroId: [''],
      Email: ['', [Validators.required, Validators.email]],
      EstacioamentoId: [''],
      LoginId: [''],
      NomeUsuario: ['', Validators.required],
      PermissaoId: [''],
      Senha: ['', Validators.minLength(8)],
      SenhaVerifica: ['', Validators.minLength(8)],
      SenhaNova:['', Validators.minLength(8)],
      Status: [''],
      TokenEmail: [''],
      AlteraSenha: [''],
    });

    const id = +this.activatedRoute.snapshot.params.id;

    if (id) {
      this.findById(id);
    }
  }

  ionViewWillEnter(){
    this.listLogins();
  }

  onSubmit() {
    if (!this.form.valid){
      this.form.markAllAsTouched;
      return;
    }

    console.log(this.form.value);

    if (this.validaatualizarLogin()){
      this.atualizarLogin();
    }
  }

  findById(id : number){
    this.loading = true;
    this.loginService
      .getLogin(id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (login) => {
          if (login) {
            console.log("chegou aqui no find by id");
            this.form.patchValue({
              ...login,
            });
            this.form.controls['AlteraSenha'].setValue('N');
          }
        },
        () =>
          this.mensagemService.error(
            `Erro ao buscar informações do login`,
            () => this.findById(id)
          )
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

  atualizarLogin(){
    this.loading = true;
    this.loginService
      .atualizarLogin(this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (dados) => {
          if (dados.dados == 'Login atualizado com sucesso.'){
            this.mensagemService.success(dados.dados);
            this.router.navigate(['/perfilusuario']);
          } else {
            this.mensagemService.error("Erro ao atualizar login, por favor tente novamente",()=>{});
          }
          console.log(dados);
        },
        (error) =>{
          console.log(error);
          this.mensagemService.error(error.error,()=>{});
        }
      );
  }


  validaatualizarLogin() : boolean {
    const id = +this.activatedRoute.snapshot.params.id;
    var nomeUsuario = this.form.controls['NomeUsuario'].value;
    var emailUsuario = this.form.controls['Email'].value;



    var existsLoginMesmoNome = this.login.find((item) => item.NomeUsuario == nomeUsuario && item.LoginId !== id);
    if (existsLoginMesmoNome){
      this.mensagemService.error("Nome de usuário indisponível.",()=>{});
      return false;
    }

    var existsLoginMesmoEmail = this.login.find((item) => item.Email == emailUsuario && item.LoginId !== id);
    if (existsLoginMesmoEmail){
      this.mensagemService.error("Email indisponível, já esta sendo utilizado por outro usuário.",()=>{});
      return false;
    }

    if (!this.isToggleBtnChecked) return true;

    var senhaAtual = this.form.controls['Senha'].value;
    var SenhaVerifica = this.form.controls['SenhaVerifica'].value;
    var SenhaNova = this.form.controls['SenhaNova'].value;

    if (senhaAtual.trim() == "" || SenhaVerifica.trim() == ""){
      this.mensagemService.error("Preencha o campo senha e confirmar senha para realizar a alteração.",()=>{});
      return false;
    }

    if (SenhaVerifica !== SenhaNova){
      this.mensagemService.error("A nova senha não correspondem, por favor preencha novamente.",()=>{});
      return false;
    }

    if (senhaAtual == SenhaNova || senhaAtual == SenhaVerifica){
      this.mensagemService.error("A senha não pode ser atualizada com a senha anterior.",()=>{});
      return false;
    }

    return true;
  }

  onToggleBtnChange(event): void {
    const isChecked = this.isToggleBtnChecked;
    this.isToggleBtnChecked = isChecked;
    var alteraSenha = this.isToggleBtnChecked ? 'S' : 'N';
    this.form.controls['AlteraSenha'].setValue(alteraSenha);
  }

}

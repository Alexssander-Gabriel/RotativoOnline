import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../model/login.model';
import { MensagemService } from '../services/mensagem/mensagem.service';
import { LoginService } from '../api/login/login.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-atualiza-login',
  templateUrl: './atualiza-login.page.html',
  styleUrls: ['./atualiza-login.page.scss'],
})

export class AtualizaLoginPage implements OnInit {
  form: FormGroup;
  loading : boolean = false;
  login : User;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private mensagemService: MensagemService,
              private httpCliente : HttpClient,
              private activatedRoute: ActivatedRoute,
              private loginService: LoginService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      CadastroId: [''],
      Email: [''],
      EstacioamentoId: [''],
      LoginId: [''],
      NomeUsuario: [''],
      PermissaoId: [''],
      Senha: [''],
      SenhaAntiga: [],
      SenhaNova:[],
      Status: [''],
      TokenEmail: ['']
    });

    const id = +this.activatedRoute.snapshot.params.id;
    
    if (id) {
      this.findById(id);
    }
  }

  onSubmit(){

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
          }
        },
        () =>
          this.mensagemService.error(
            `Erro ao buscar informações do login`,
            () => this.findById(id)
          )
      );
  }

}

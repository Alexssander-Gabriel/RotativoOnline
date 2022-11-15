import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../../model/login.model';
import { MensagemService } from '../../../../services/mensagem/mensagem.service';

@Component({
  selector: 'app-perfilusuario',
  templateUrl: './perfilusuario.page.html',
  styleUrls: ['./perfilusuario.page.scss'],
})
export class PerfilusuarioPage implements OnInit {

  user : User;

  constructor(private router: Router, private mensagemService: MensagemService) { }

  ngOnInit() {
  }

  public optionsPerfilUsuario =[
    {icon :'person-outline' , text: 'Atualizar Cadastro' , rota: '/atualizar-cadastro'},
    {icon :'person-circle-outline' , text: 'Atualizar Login' , rota: '/atualiza-login'},
    {icon :'wallet-outline' , text: 'Métodos de Pagamento' , rota: '/metodospagamento-lista'}
  ]

  abrirTela(rota: string){
    console.log("rota", rota);
    this.user = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (rota == "/atualizar-cadastro"){
      if (this.user == undefined || !this.user){
        console.log("não encontrou usuario");
        this.mensagemService.error("Erro ao buscar informações do cadastro, por favor, faça login novamente!",()=>{});
        this.router.navigate(["/welcome/sign-in"]);
      } else {
        console.log("encontrou usuario");
        this.router.navigate(['/atualizar-cadastro',this.user.CadastroId]);
      }
    } else if(rota == "/atualiza-login"){
      if (this.user == undefined || !this.user){
        this.mensagemService.error("Erro ao buscar informações do login, por favor, faça login novamente!",()=>{});
        this.router.navigate(["/welcome/sign-in"]);
      }
      console.log("vai atualizar o login");
      console.log("id do login")
      this.router.navigate(['/atualiza-login',this.user.LoginId]);
    }
    else if (rota == '/metodospagamento-lista'){
      this.router.navigate(['/metodospagamento-lista', this.user.CadastroId]);
    }else {
      this.router.navigate([rota]);
    }
  }
}

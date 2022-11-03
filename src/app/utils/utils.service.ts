import { Injectable } from '@angular/core';
import { User } from '../model/login.model';
import { Router } from '@angular/router';
import { MensagemService } from '../services/mensagem/mensagem.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  user : User;

  constructor(private router: Router,
              private mensagemService: MensagemService) { }


  logarUsuario(usuario : User, rota : string = "", mostraMsg : boolean = false){
    if (usuario !== undefined && usuario){
      sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      if (mostraMsg){
        this.mensagemService.success("Usuário logado com sucesso!");
      }
    } else {
      if (mostraMsg){
        this.mensagemService.error("Usuário ou Senha Incorreto(s)", ()=>{});
      }
    }

    if (rota !== undefined && rota !== "" && rota.trim().length > 0){
      this.router.navigate([rota]);
    }

  }

  getUsuario(rota : string = "", mostraMsg : boolean = false, msgPersonalizada  : string = "") : User {
    var mensagem = "Erro ao buscar informações de login, por favor, faça login novamente";

    if (msgPersonalizada !== undefined && msgPersonalizada !== "" && msgPersonalizada.trim().length > 0){
      mensagem = msgPersonalizada;
    }

    this.user = JSON.parse(sessionStorage.getItem('usuarioLogado'));
    if (this.user !== undefined && this.user ){
      return this.user;
    } else {
      if (rota !== "" && rota.trim().length > 0){
        this.router.navigate([rota]);
      }
      if (mostraMsg){
        this.mensagemService.error(mensagem,()=>{});
      }
      return undefined;
    }
  }

  logOffUsuario(){
    sessionStorage.setItem('usuarioLogado', null);
  }

  formataUrlFoto(urlFoto : string = "") : string {
    if (urlFoto !== undefined && urlFoto.trim().length > 0){
        urlFoto = urlFoto.replace(".PNG",".png");
        urlFoto = urlFoto.replace(".JPG",".jpg");
        urlFoto = urlFoto.replace(".JPEG",".jpeg");

        if (urlFoto.indexOf(',') != -1){
          var foto = urlFoto.substring(0, urlFoto.indexOf(','));
          urlFoto = "/assets/imgs" + foto;
        } else {
          urlFoto = "/assets/imgs" + urlFoto;
        }
        // console.log("Depois :", x.UrlFoto);
      } else {
        urlFoto = "/assets/imgs/estacionamentos/semimagem.png";
      }

      return urlFoto;
  }

  formataData(data : string, mostraHora : boolean = false) : string{
    if (data !== undefined && data){
       var dataFormatada = data.substring(8,10) + '/' + data.substring(5,7) + '/' + data.substring(0,4);
       var horaFormatada = data.substring(11,19);
       console.log(data);
       if (mostraHora){
        return dataFormatada + ' - ' + horaFormatada;
       } else {
        return dataFormatada;
       }

    } else{
      return undefined;
    }

  }

  retornaDia(data, adicionaFeira : boolean = false) : string{
    var newData = new Date(data);
    var diaSemana = newData.getDay();
    var dia = "";
    console.log("Data recebida: ", data + " dia da semana : " + diaSemana);
    switch (diaSemana) {
      case 0:
        dia = "Segunda";
        break;
      case 1:
        dia = "Terça";
        break;
      case 2:
        dia = "Quarta";
        break;
      case 3:
        dia = "Quinta";
        break;
      case 4:
        dia = "Sexta";
        break;
      case 5:
        dia = "Sábado";
        break;
      case 6:
        dia = "Domingo";
        break;
      default:
        dia = "";
    }

    if (adicionaFeira && dia !== undefined && dia.trim().length > 0 && diaSemana < 6){
      dia = dia + "-Feira,";
    }

    return dia;
  }
}

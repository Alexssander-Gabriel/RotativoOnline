import { Injectable } from '@angular/core';
import { User } from '../../model/login.model';
import { Router } from '@angular/router';
import { MensagemService } from '../mensagem/mensagem.service';
import { DiasAtendimento } from 'src/app/model/diasatendimento.model';

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

    if (adicionaFeira && dia !== undefined && dia.trim().length > 0 && diaSemana < 5){
      dia = dia + "-Feira";
    }

    return dia;
  }

  validaDiasAtendimento(diasAtendimento : DiasAtendimento[],mostraMensagem : boolean = false, entrada : any = undefined, saida : any = undefined) : boolean {
    var dataAtual = new Date(Date.now());
    var diaSemana = dataAtual.getDay();
    diaSemana = diaSemana - 1;
    var atendeNesseDia = diasAtendimento.find((item)=>
      item.Dia == diaSemana
    );

    if (!atendeNesseDia ){
      if (mostraMensagem) this.mensagemService.error("Estacionamento não atende nesse dia.", ()=>{});
      return false;
    }

    var atendeNesseHorario = diasAtendimento.find((item)=> {
      const [horaEntrada, minutoEntrada] = String(item.HoraEntrada).split(":")
      const [horaSaida, minutoSaida] = String(item.HoraSaida).split(":");

      var dateEntrada = new Date(entrada);
      var dateSaida = new Date(saida);

      console.log(dateEntrada);
      console.log(dateSaida);

      var validaEntrada : boolean = false;

      if (dateEntrada.getHours() > Number(horaEntrada)){
        validaEntrada = true;
      } else if (dateEntrada.getHours() == Number(horaEntrada) && dateEntrada.getMinutes() >= Number(minutoEntrada)){
        validaEntrada = true;
      }

      var validaSaida : boolean = false;

      if (dateSaida.getHours() < Number(horaSaida)){
        validaSaida = true;
      } else if (dateSaida.getHours() == Number(horaSaida) && dateSaida.getMinutes() <= Number(minutoSaida)){
        validaSaida = true;
      }

      if (validaEntrada && validaSaida){
        return item;
      }

     })

    if (!atendeNesseHorario){
      this.mensagemService.error("Estacionanto não atende nesse horário de reserva, verifique os dias e horários de atendimento",()=>{});
      return false;
    }

    return true;
  }

}

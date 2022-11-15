import { Time } from '@angular/common';
import { Login } from 'src/app/model/login.model';
import { Injectable } from '@angular/core';
import { User } from '../../model/login.model';
import { Router } from '@angular/router';
import { MensagemService } from '../mensagem/mensagem.service';
import { Cadastro } from 'src/app/model/cadastro.model';
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
    console.log(diaSemana);
    console.log(diasAtendimento);
    var atendeNesseDia = diasAtendimento.find((item)=>
      item.Dia == diaSemana
    );

    if (!atendeNesseDia ){
      if (mostraMensagem) this.mensagemService.error("Estacionamento não atende nesse dia.", ()=>{});
      return false;
    }

    // console.log("Começa aqui a validar");
    // console.log(diasAtendimento);

    // console.log(entrada);
    // console.log(saida);


    // const currentTimeFormatted = (currentDate?: Date): string => {
    //   const time = currentDate || new Date(),
    //     hour = time.getHours().toString().padStart(2, '0'),
    //     minutes = time.getMinutes().toString().padStart(2, '0'),
    //     seconds = time.getSeconds().toString().padStart(2, '0');

    //   return `${hour}:${minutes}:${seconds}`;
    // };

    var atendeNesseHorario = diasAtendimento.find((item)=> {
      const [horaEntrada, minutoEntrada] = String(item.HoraEntrada).split(":")
      const [horaSaida, minutoSaida] = String(item.HoraSaida).split(":");

      var dateEntrada = new Date(entrada);
      var dateSaida = new Date(saida);

    //   console.log(dateEntrada);
    //   console.log(dateSaida);


    //   console.log('Entrada - Hora: ' + horaEntrada + ' minuto: ' +  minutoEntrada);
    //   console.log('horas entrada - ' + dateEntrada.getHours());
    //   console.log('minutos entrada - ' + dateEntrada.getMinutes());


    //   console.log('Saida - Hora: ' + horaSaida + ' minuto: ' +  minutoSaida);
    //   console.log('horas saida - ' + dateSaida.getHours());
    //   console.log('minutos saida - ' + dateSaida.getMinutes());



      if (Number(horaEntrada) <= entrada.hours && Number(minutoEntrada) <= entrada.minutes ) {
        console.log("validou entrada");
        return undefined
      }

      if (Number(horaSaida) >= saida.hours && Number(minutoSaida) >= saida.minutes ) {
        console.log("Validou saida");
        return undefined
      }


    //   if (dateEntrada.getHours() < Number(horaEntrada)){

     //  }



    //   return item

     })

    // // var atendeNesseHorario = diasAtendimento.find((item)=> item.HoraEntrada <= entrada && item.HoraSaida >= saida)
    // console.log(atendeNesseHorario);
    // if (!atendeNesseHorario){
    //   if (mostraMensagem) this.mensagemService.error("Estacionamento não atende nesse horário.", ()=>{});
    //   return false;
    // }

    return true;
  }

}

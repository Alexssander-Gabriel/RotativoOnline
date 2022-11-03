import { Time } from "@angular/common";

export class Reserva {
    ReservaId: number;
    CadastroId: number;
    DataEntrada: Date;
    HoraEntrada: Time;
    DataSaida: Date;
    HoraSaida: Time;
    Observacao: string;
    EstacionamentoId: number;
    NomeEstacionamento: string;
    NomeCadastro: string;
    UrlFoto: string;
    ValorAntecipado: number;
    DiaSemana: string;
  }

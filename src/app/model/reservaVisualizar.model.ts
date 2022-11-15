import { Time } from "@angular/common";

export interface ReservaVisualizar{
  EstacionamentoId: number;
  NomeEstacionamento: string,
  DescricaoFormaPagamento: string,
  Valor: number,
  DataEntrada: Date,
  HoraEntrada: Time,
  DataSaida: Date,
  HoraSaida: Time,
  STATUS: string,
  DescricaoMetodoPagamento: string,
  Observacao: string
}

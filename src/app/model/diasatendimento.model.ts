import { Time } from '@angular/common';

export interface DiasAtendimento{
  DiasAtendimentoId: number,
  EstacionamentoId: number,
  HoraEntrada: Time,
  HoraSaida: Time,
  DiaDesc: string,
  Aberto: string,
  Dia: number
}

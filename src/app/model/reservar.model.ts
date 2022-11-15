import { FormaPagamento } from './formapagamento.model';
import { Estacionamento } from "./estacionamentos.model";
import { MetodosPagamento } from "./metodospagamento.model";

export interface CalculaVerificaValores {
    Verificacao: string
}

export interface VerificacaoProps {
    liberaPagarAdiantado: string;
    minutos: string;
    valor: string;
    tempoDesc;
}

export interface Reservar {
    Estacionamento: Estacionamento;
    MetodosPagamento: MetodosPagamento;
    FormaPagamento: FormaPagamento;
    DataEntrada: string;
    DataSaida: string;
    Valor: Number;
}

export class ReservarClass implements Reservar{
  Estacionamento: Estacionamento;
  MetodosPagamento: MetodosPagamento;
  FormaPagamento: FormaPagamento;
  DataEntrada: string;
  DataSaida: string;
  Valor: Number;
}

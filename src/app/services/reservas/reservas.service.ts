import { Dados } from './../../model/dados.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from 'src/app/model/reservas.model';
import { environment } from 'src/environments/environment';
import { ReservaVisualizar } from 'src/app/model/reservaVisualizar.model';


@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  constructor(private httpCliente : HttpClient) { }

  getReservas(): Observable<Reserva[]> {
    return this.httpCliente.get<Reserva[]>(`${environment.apiUrl}/reservas/lista`);
  }

  getReserva(id: number): Observable<Reserva> {
    return this.httpCliente.get<Reserva>(`${environment.apiUrl}/reservas/lista/${id}`);
  }

  getReservaCadastro(id: number): Observable<Reserva[]> {
    return this.httpCliente.get<Reserva[]>(`${environment.apiUrl}/reservas/reservacadastro/${id}`);
  }

  reservar(reserva: Reserva): Observable<Reserva> {
      console.log(reserva);
      return this.httpCliente.post<Reserva>(`${environment.apiUrl}/reservas/reservar`, reserva);
  }

  getReservasUtilizadas(id : number): Observable<Dados>{
    return this.httpCliente.get<Dados>(`${environment.apiUrl}/reservas/resevautilizada/${id}`);
  }

  cancelarReserva(id : number): Observable<Dados>{
    return this.httpCliente.get<Dados>(`${environment.apiUrl}/reservas/cancelarreserva/${id}`);
  }

  visualizarResumo(id: number): Observable<ReservaVisualizar>{
    return this.httpCliente.get<ReservaVisualizar>(`${environment.apiUrl}/reservas/visualizarResumo/${id}`);
  }

}

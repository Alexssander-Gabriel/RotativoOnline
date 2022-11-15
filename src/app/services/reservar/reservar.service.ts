import { Dados } from './../../model/dados.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalculaVerificaValores, Reservar } from 'src/app/model/reservar.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservarService {

  constructor(private httpClient: HttpClient) { }

  getCalculaVerificaValores(reservar : Reservar): Observable<CalculaVerificaValores> {
    return this.httpClient.post<CalculaVerificaValores>(`${environment.apiUrl}/reservar/verificacalculavalor`,reservar);
  }

  confirmarReserva(reservar : Reservar): Observable<Dados> {
    return this.httpClient.post<Dados>(`${environment.apiUrl}/reservar/confirmarreserva`,reservar);
  }

}

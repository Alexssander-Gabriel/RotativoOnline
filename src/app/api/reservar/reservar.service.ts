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

  confirmarReserva(reservar : Reservar): Observable<Reservar> {
    return this.httpClient.post<Reservar>(`${environment.apiUrl}/reservar/confirmarreserva`,reservar);
  }

}

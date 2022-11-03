import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estacionamento } from 'src/app/model/estacionamentos.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstacionamentosService {

  constructor(private httpCliente : HttpClient) { }

  getEstacionamentos(): Observable<Estacionamento[]> {
    return this.httpCliente.get<Estacionamento[]>(`${environment.apiUrl}/estacionamentos/lista`);
  }

  getEstacionamento(id : number): Observable<Estacionamento> {
    return this.httpCliente.get<Estacionamento>(`${environment.apiUrl}/estacionamentos/lista/${id}`);
  }
}



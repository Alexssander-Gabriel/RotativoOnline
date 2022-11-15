import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estacionamento } from 'src/app/model/estacionamentos.model';
import { environment } from 'src/environments/environment';
import { EstacionamentoFotos } from 'src/app/model/estacionamentofotos.model';

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

  getFiltroPreciso(): Observable<Estacionamento[]> {
    return this.httpCliente.get<Estacionamento[]>(`${environment.apiUrl}/estacionamentos/filtroPreciso`);
  }

  getFotosEstacionamento(id: number): Observable<EstacionamentoFotos>{
    return this.httpCliente.get<EstacionamentoFotos>(`${environment.apiUrl}/estacionamentos/estacionamentofotos/${id}`);
  }
}



import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DiasAtendimento } from 'src/app/model/diasatendimento.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiasatendimentoService {

  constructor(private httpCliente :HttpClient) { }

  getDiasAtendimento(): Observable<DiasAtendimento[]> {
    return this.httpCliente.get<DiasAtendimento[]>(`${environment.apiUrl}/diasatendimento/lista`);
  }

  getDiasAtendimentoByEstacionamentoId(id: number): Observable<DiasAtendimento[]> {
    return this.httpCliente.get<DiasAtendimento[]>(`${environment.apiUrl}/diasatendimento/lista/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormaPagamento } from 'src/app/model/formapagamento.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService {

  constructor(private httpCliente : HttpClient) { }

  getFormasPagamento(): Observable<FormaPagamento[]> {
    return this.httpCliente.get<FormaPagamento[]>(`${environment.apiUrl}/formapagamento/lista`);
  }

  getFormaPagamento(id : number): Observable<FormaPagamento> {
    return this.httpCliente.get<FormaPagamento>(`${environment.apiUrl}/formapagamento/lista/${id}`);
  }
}

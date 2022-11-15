import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MetodosPagamento } from 'src/app/model/metodospagamento.model';
import { Carteira } from 'src/app/model/carteira.model';
import { Dados } from 'src/app/model/dados.model';

@Injectable({
  providedIn: 'root'
})
export class MetodospagamentoService {

  constructor(private httpCliente: HttpClient) { }

  getMetodosPagamentos(): Observable<MetodosPagamento[]> {
    return this.httpCliente.get<MetodosPagamento[]>(`${environment.apiUrl}/metodospagamento/lista`);
  }

  getMetodosPagamentosByCadastro(id: number): Observable<MetodosPagamento[]> {
    return this.httpCliente.get<MetodosPagamento[]>(`${environment.apiUrl}/metodospagamento/listacadastro/${id}`);
  }

  getMetodoPagamento(id : number): Observable<MetodosPagamento> {
    return this.httpCliente.get<MetodosPagamento>(`${environment.apiUrl}/metodospagamento/lista/${id}`);
  }

  getMetodoPagamentoUtilizado(id : number): Observable<Dados> {
    return this.httpCliente.get<Dados>(`${environment.apiUrl}/metodospagamento/utilizado/${id}`);
  }

  delete(id : number): Observable<Dados> {
    console.log("Exluir metodo de pagamento");
    return this.httpCliente.get<Dados>(`${environment.apiUrl}/metodospagamento/delete/${id}`);
  }

  save(carteira: Carteira): Observable<Carteira> {
    if(carteira.CarteiraId > 0) {
      console.log("atualiza");
      return this.httpCliente.put<Carteira>(`${environment.apiUrl}/metodospagamento/atualiza/${carteira.CarteiraId}`, carteira);
    } else {
      console.log("Insere");
      console.log(carteira);
      return this.httpCliente.post<Carteira>(`${environment.apiUrl}/metodospagamento/adiciona`, carteira);
    }
  }

  atualizarMetodoPagamento(carteira: Carteira): Observable<Dados>{
    return this.httpCliente.post<Dados>(`${environment.apiUrl}/metodospagamento/atualizar`, carteira);
  }
}

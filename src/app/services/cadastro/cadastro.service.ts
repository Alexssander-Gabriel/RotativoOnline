import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cadastro } from 'src/app/model/cadastro.model';
import { environment } from 'src/environments/environment';
import { Dados } from 'src/app/model/dados.model';


@Injectable({
  providedIn: 'root'
})

export class CadastroService {

  constructor(private httpCliente : HttpClient) { }

  getCadastro(id : number): Observable<Cadastro> {
    return this.httpCliente.get<Cadastro>(`${environment.apiUrl}/cadastro/lista/${id}`);
  }

  getCadastros(): Observable<Cadastro[]> {
    return this.httpCliente.get<Cadastro[]>(`${environment.apiUrl}/cadastro/lista/`);
  }

  atualizarCadastro(cadastro : Cadastro): Observable<Dados> {
    return this.httpCliente.post<Dados>(`${environment.apiUrl}/cadastro/atualizar`,cadastro);
  }
}

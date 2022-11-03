import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cadastro } from 'src/app/model/cadastro.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class CadastroService {

  constructor(private httpCliente : HttpClient) { }

  getCadastro(id : number): Observable<Cadastro> {
    return this.httpCliente.get<Cadastro>(`${environment.apiUrl}/cadastro/lista/${id}`);
  }
}

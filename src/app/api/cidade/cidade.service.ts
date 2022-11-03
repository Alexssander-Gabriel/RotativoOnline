import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cidade } from 'src/app/model/cidade.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {

  constructor(private httpCliente : HttpClient) { }

  getCidades(){
    return this.httpCliente.get<Cidade>(`${environment.apiUrl}/cidade/lista`);
  }
}


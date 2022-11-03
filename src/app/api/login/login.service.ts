import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login, User } from 'src/app/model/login.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient : HttpClient) { }

  getLogins(){
    return this.httpClient.get<Login>(`${environment.apiUrl}/login/lista`);
  }

  getLogin(id : number): Observable<User> {
    return this.httpClient.get<User>(`${environment.apiUrl}/login/lista/${id}`);
  }

  save(usuario: User): Observable<User> {
    if(usuario.LoginId > 0) {
      console.log("atualiza");
      return this.httpClient.put<User>(`${environment.apiUrl}/listaCompras/${usuario.LoginId}`, usuario);
    } else {
      console.log("Insere");
      return this.httpClient.post<User>(`${environment.apiUrl}/login/adiciona`, usuario);
    }
  }
}


export interface Login {
  dados: {
    CadastroId: number;
    Email: string;
    EstacionamentoId: number;
    LoginId: number;
    NomeUsuario: string;
    PermissaoId: number;
    Senha: string;
    TokenEmail: string;
  }[]
}

export class User {
  CadastroId: number;
  Email: string;
  LoginId: number;
  NomeUsuario: string;
  PermissaoId: number;
  TokenEmail: string;
}
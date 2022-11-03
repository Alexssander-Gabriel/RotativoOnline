export interface MetodosPagamento{
    CarteiraId: number;
    CadastroId: number;
    CodigoPix: string;
    CodigoSegurancaCartao: string;
    DataExpiracaoCartao: string;
    EmpresaId: number;
    NumeroCartao: string;
    Status: String;
    TipoCartao: String;
    NomeCadastro: string;
    Descricao: string;
}
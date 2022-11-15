export interface EstacionamentoFotos{
  sucesso: string,
  dados: fotos[]
}

export interface fotos {
  EstacionamentoId: number,
  UrlFoto: string
}

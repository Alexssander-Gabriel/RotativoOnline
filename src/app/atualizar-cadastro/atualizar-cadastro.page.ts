import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Login } from '../model/login.model';
import { MensagemService } from '../services/mensagem/mensagem.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Cidade, Cidades } from '../model/cidade.model';
import { CadastroService } from '../api/cadastro/cadastro.service';
import { finalize } from 'rxjs/operators';
import { CidadeService } from '../api/cidade/cidade.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-atualizar-cadastro',
  templateUrl: './atualizar-cadastro.page.html',
  styleUrls: ['./atualizar-cadastro.page.scss'],
})
export class AtualizarCadastroPage implements OnInit {

  form: FormGroup;
  login: Login;
  loading : boolean = false;
  cidade : Cidade;
  cidades : Cidades[];

  constructor(private formBuilder: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private cadastroService: CadastroService,
              private mensagemService: MensagemService,
              private cidadeService: CidadeService,
              private httpCliente : HttpClient) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      BairroEndereco: ['', [Validators.required, Validators.minLength(1)]],
      CadastroId: [''],
      CidadeId: ['', Validators.required],
      Complemento: ['',[Validators.required, Validators.minLength(1)]],
      Cpf: ['', [Validators.required, Validators.minLength(1)]],
      Endereco: ['', [Validators.required, Validators.minLength(1)]],
      Mensalista: [''],
      Nome: ['', [Validators.required, Validators.minLength(1)]],
      NumeroCelular: [''],
      NumeroEndereco: ['', [Validators.required, Validators.minLength(1)]],
      NumeroTelefone: ['', [Validators.required, Validators.minLength(1)]],
      NumeroCep: ['',[Validators.required, Validators.min(1)]],
      TipoCadastro: ['']
    });

    const id = +this.activatedRoute.snapshot.params.id;

    if (id) {
      this.findById(id);
    }
  }

  ionViewWillEnter(): void {
    this.listCidades();
  }

  findById(id){
    this.loading = true;
    this.cadastroService
      .getCadastro(id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (cadastro) => {
          if (cadastro) {
            console.log("chegou aqui no find by id");
            this.form.patchValue({
              ...cadastro,
            });
          }
        },
        () =>
          this.mensagemService.error(
            `Erro ao buscar o cadastro com codigo ${id}`,
            () => this.findById(id)
          )
      );
  }

  listCidades() {
    this.loading = true;
    this.cidadeService
      .getCidades()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (cidades) => {
          this.cidade = cidades;
          this.cidades = this.cidade.dados;
        },
        async (error) => {
        }
      );
  }

  compareWithCidade(o1: Cidades, o2: Cidades | Cidades[]) {
    if (!o1 || !o2) {
      return o1 === o2;
    }

    if (Array.isArray(o2)) {
      return o2.some((u: Cidades) => u.CidadeId === o1.CidadeId);
    }

    return o1.CidadeId === o2.CidadeId;
  }

  buscaCep(){
    //console.log('Chegou aqui no cep');
    const cepValue = this.form.controls['numeroCep'].value;
    const isValid = this.form.controls['numeroCep'].valid;
    if (isValid){
      //console.log('VALIDO');
      try {
        this.httpCliente.get(`https://viacep.com.br/ws/${cepValue}/json/`)
        .subscribe(data => {
          this.insererValoresEndereco(data);
        })
      } catch (error) {

      }
    }
  }

  insererValoresEndereco(dados){
    this.form.controls['Endereco'].setValue(dados.logradouro);
    this.form.controls['BairroEndereco'].setValue(dados.bairro);

    if (dados.uf !== undefined && dados.uf.trim() != '') {
      var cidadeCep = this.cidades.find((item)=>{
        return item.Estado.toLowerCase().trim() == dados.uf.toLowerCase().trim()
            && item.NomeCidade.toLowerCase().trim() == dados.localidade.toLowerCase().trim();
      });
      if (cidadeCep){
        this.form.controls['cidade'].setValue(cidadeCep);
      }
    }
    //console.log(this.form.controls['cidade'].value);
  }

  onSubmit(){

  }
}

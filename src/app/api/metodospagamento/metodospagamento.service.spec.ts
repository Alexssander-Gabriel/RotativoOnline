import { TestBed } from '@angular/core/testing';

import { MetodospagamentoService } from './metodospagamento.service';

describe('MetodospagamentoService', () => {
  let service: MetodospagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetodospagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DiasatendimentoService } from './diasatendimento.service';

describe('DiasatendimentoService', () => {
  let service: DiasatendimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiasatendimentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

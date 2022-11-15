import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MetodospagamentoListaPage } from './metodospagamento-lista.page';

describe('MetodospagamentoListaPage', () => {
  let component: MetodospagamentoListaPage;
  let fixture: ComponentFixture<MetodospagamentoListaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodospagamentoListaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MetodospagamentoListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

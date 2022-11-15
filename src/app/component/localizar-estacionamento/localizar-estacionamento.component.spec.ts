import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocalizarEstacionamentoComponent } from './localizar-estacionamento.component';

describe('LocalizarEstacionamentoComponent', () => {
  let component: LocalizarEstacionamentoComponent;
  let fixture: ComponentFixture<LocalizarEstacionamentoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalizarEstacionamentoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocalizarEstacionamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

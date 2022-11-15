import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MetodoPagamentoCadastroPage } from './metodo-pagamento-cadastro.page';

describe('MetodoPagamentoCadastroPage', () => {
  let component: MetodoPagamentoCadastroPage;
  let fixture: ComponentFixture<MetodoPagamentoCadastroPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MetodoPagamentoCadastroPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MetodoPagamentoCadastroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

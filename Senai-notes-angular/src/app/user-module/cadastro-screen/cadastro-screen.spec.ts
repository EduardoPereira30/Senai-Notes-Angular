import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroScreen } from './cadastro-screen';

describe('CadastroScreen', () => {
  let component: CadastroScreen;
  let fixture: ComponentFixture<CadastroScreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroScreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroScreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

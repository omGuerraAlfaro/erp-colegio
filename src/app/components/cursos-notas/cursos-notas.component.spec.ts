import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosNotasComponent } from './cursos-notas.component';

describe('CursosNotasComponent', () => {
  let component: CursosNotasComponent;
  let fixture: ComponentFixture<CursosNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursosNotasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

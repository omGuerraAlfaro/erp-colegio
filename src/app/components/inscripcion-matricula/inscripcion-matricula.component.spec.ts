import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionMatriculaComponent } from './inscripcion-matricula.component';

describe('InscripcionMatriculaComponent', () => {
  let component: InscripcionMatriculaComponent;
  let fixture: ComponentFixture<InscripcionMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscripcionMatriculaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

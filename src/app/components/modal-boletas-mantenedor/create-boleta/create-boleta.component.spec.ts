import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBoletaComponent } from './create-boleta.component';

describe('CreateBoletaComponent', () => {
  let component: CreateBoletaComponent;
  let fixture: ComponentFixture<CreateBoletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateBoletaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBoletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

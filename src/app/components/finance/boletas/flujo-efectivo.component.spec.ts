import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlujoEfectivoComponent } from './flujo-efectivo.component';

describe('FlujoEfectivoComponent', () => {
  let component: FlujoEfectivoComponent;
  let fixture: ComponentFixture<FlujoEfectivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlujoEfectivoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlujoEfectivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

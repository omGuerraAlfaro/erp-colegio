import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar2',
  templateUrl: './sidebar2.component.html',
  styleUrls: ['./sidebar2.component.css']
})
export class Sidebar2Component implements OnInit {

  activo = false;
  pasivo = false;
  patrimonio = false;
  ingreso = false;
  egreso = false;
  resumen = true;

  constructor() { }

  ngOnInit(): void {
  }

  activoClick() {
    this.activo = !this.activo;
    this.pasivo = false;
    this.patrimonio = false;
    this.ingreso = false;
    this.egreso = false;
    this.resumen = false;
  }

  pasivoClick() {
    this.activo = false;
    this.pasivo = !this.pasivo;
    this.patrimonio = false;
    this.ingreso = false;
    this.egreso = false;
  }

  patrimonioClick() {
    this.activo = false;
    this.pasivo = false;
    this.patrimonio = !this.patrimonio;
    this.ingreso = false;
    this.egreso = false;
    this.resumen = false;
  }

  ingresoClick() {
    this.activo = false;
    this.pasivo = false;
    this.patrimonio = false;
    this.ingreso = !this.ingreso;
    this.egreso = false;
    this.resumen = false;
  }

  egresoClick() {
    this.activo = false;
    this.pasivo = false;
    this.patrimonio = false;
    this.ingreso = false;
    this.egreso = !this.egreso;
    this.resumen = false;    
  }

  resumenClick() {
    this.activo = false;
    this.pasivo = false;
    this.patrimonio = false;
    this.ingreso = false;
    this.egreso = false;
    this.resumen = !this.resumen;    
  }

}

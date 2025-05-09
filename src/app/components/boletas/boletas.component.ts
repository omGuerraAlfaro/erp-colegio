import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import { PorcentajeMesDto, ResumenApoderadoMorosoDto, TotalPagadoMes } from 'src/app/interfaces/apoderadoInterface';
import { ModalVerBoletasComponent } from '../modal-ver-boletas/modal-ver-boletas.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-boletas',
  templateUrl: './boletas.component.html',
  styleUrls: ['./boletas.component.css']
})
export class BoletasComponent implements OnInit {

  get morososVerdes(): ResumenApoderadoMorosoDto[] {
    return this.morosos.filter(m => m.nivelAlerta === 'verde');
  }
  get morososAmarillos(): ResumenApoderadoMorosoDto[] {
    return this.morosos.filter(m => m.nivelAlerta === 'amarillo');
  }
  get morososRojos(): ResumenApoderadoMorosoDto[] {
    return this.morosos.filter(m => m.nivelAlerta === 'rojo');
  }

  porcentajes: PorcentajeMesDto[] = [];
  morosos: ResumenApoderadoMorosoDto[] = [];
  cantMorosos = 0;
  sumBoletasVencidas = 0;
  sumBoletasPagadas = 0;
  sumMontoVencido = 0;

  displayedColumns: string[] = [
    'select',
    'nombre',
    'rut',
    'monto',
    'boletas',
    'dias',
    'meses',
    'acciones'
  ];

  monthAbbr = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];


  constructor(private boletasService: BoletasService, private bottomSheet: MatBottomSheet) { }

  ngOnInit(): void {
    // 1) Cargar morosos y calcular totales
    this.boletasService.getMorosos().subscribe({
      next: data => {
        this.morosos = data;
        this.cantMorosos = data.length;
        this.sumBoletasVencidas = data.reduce((acc, m) => acc + m.totalBoletasVencidas, 0);
        this.sumMontoVencido = data.reduce((acc, m) => acc + m.montoTotalVencido, 0);
      },
      error: err => console.error('Error cargando morosos', err)
    });

    // 2) Graficar total pendiente vs pagado (myChart3)
    this.loadChart3();

    // 3) Cargar porcentajes y graficar porcentaje pagado (myChart4)
    this.boletasService.getPorcentajePagadoPorMes("2025-12-31").subscribe({
      next: data => {
        this.porcentajes = data;
        this.renderChart4();
      },
      error: err => console.error('Error cargando porcentajes', err)
    });
  }

  private getTodayString(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  private loadChart3(): void {
    const fecha = this.getTodayString();
    this.boletasService.getTotalPendientePorMes(fecha).subscribe(pendienteData => {
      this.boletasService
        .getTotalPagadoPorMes(fecha)
        .subscribe((pagadoData: TotalPagadoMes[]) => {
          this.renderChart3(pendienteData, pagadoData);

          this.sumBoletasPagadas = pagadoData.reduce<number>(
            (acc, curr) => acc + +curr.total_pagado,
            0
          );

          console.log('Total Pagado:', this.sumBoletasPagadas);
        });
    });
  }


  private renderChart3(pendienteData: any[], pagadoData: any[]): void {
    const labels = pendienteData.map(i => this.convertDateToMonthName(i.mes));
    const pendienteVals = pendienteData.map(i => i.total_pendiente_vencido);
    const pagadoVals = pagadoData.map(i => i.total_pagado);

    new Chart('myChart3', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Total Pendiente Vencido',
            data: pendienteVals,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Total Pagado',
            data: pagadoVals,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  private renderChart4(): void {
    const pctLabels = this.porcentajes.map(p => this.convertDateToMonthName(p.mes));
    const pctVals = this.porcentajes.map(p => p.porcentaje);

    new Chart('myChart4', {
      type: 'line',
      data: {
        labels: pctLabels,
        datasets: [{
          label: 'Porcentaje Pagado Mensual',
          data: pctVals,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }

  private convertDateToMonthName(dateString: string): string {
    const [year, month] = dateString.split('-');
    const d = new Date(+year, +month - 1, 1);
    return d.toLocaleDateString('es-ES', { month: 'long' });
  }

  openModalVerBoletas(m: any): void {
    console.log('Abrir modal de ver boletas', m);
    // Implementar lógica para abrir el modal de ver boletas
  }

  verBoletas(m: ResumenApoderadoMorosoDto): void {
    this.bottomSheet.open(ModalVerBoletasComponent, {
      data: {
        apoderadoId: m.rut.split('-')[0],
        nombre: m.nombre
      }
    });
  }
}

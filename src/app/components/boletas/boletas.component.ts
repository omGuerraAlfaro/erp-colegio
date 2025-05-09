// boletas.component.ts
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import {
  PorcentajeMesDto,
  ResumenApoderadoMorosoDto,
  TotalPagadoMes
} from 'src/app/interfaces/apoderadoInterface';
import { ModalVerBoletasComponent } from '../modal-ver-boletas/modal-ver-boletas.component';

@Component({
  selector: 'app-boletas',
  templateUrl: './boletas.component.html',
  styleUrls: ['./boletas.component.css']
})
export class BoletasComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // arrays y totales
  porcentajes: PorcentajeMesDto[] = [];
  morosos: ResumenApoderadoMorosoDto[] = [];
  cantMorosos = 0;
  sumBoletasVencidas = 0;
  sumMontoVencido = 0;
  sumBoletasPagadas = 0;
  sumTransaccionesTerminadas = 0;
  sumTransaccionesTerminadasMes = 0;
  goalTotalBoletas = 0;   // suma de **todos** los montos
  sumPagadoBoletas = 0;   // suma de los estado_id = 2
  sumPendienteBoletas = 0;
  totalMatriculasEnero = 0;

  monthAbbr = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // columnas para el detalle general
  displayedColumns = [
    'select', 'nombre', 'rut', 'monto', 'boletas', 'dias', 'meses', 'acciones'
  ];

  // tabla historial WebPay
  historialTransaccionesDataSource = new MatTableDataSource<any>();
  displayedColumnsHistorial = [
    'estado', 'fecha', 'apoderado', 'rut', 'boleta', 'detalle', 'monto'
  ];

  constructor(
    private boletasService: BoletasService,
    private bottomSheet: MatBottomSheet
  ) { }

  // getters para los tres niveles de morosos
  get morososVerdes(): ResumenApoderadoMorosoDto[] {
    return this.morosos.filter(m => m.nivelAlerta === 'verde');
  }
  get morososAmarillos(): ResumenApoderadoMorosoDto[] {
    return this.morosos.filter(m => m.nivelAlerta === 'amarillo');
  }
  get morososRojos(): ResumenApoderadoMorosoDto[] {
    return this.morosos.filter(m => m.nivelAlerta === 'rojo');
  }

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

    // 2) Cargar gráficos mensuales y luego anuales
    this.loadChart3();

    // 3) Cargar porcentajes pagado mensual
    this.boletasService.getPorcentajePagadoPorMes("2025-12-31").subscribe({
      next: data => {
        this.porcentajes = data;
        this.renderChart4();
      },
      error: err => console.error('Error cargando porcentajes', err)
    });

    // 4) Cargar historial de transacciones y orden inverso
    this.boletasService.getHistorialTransacciones().subscribe({
      next: data => {
        this.historialTransaccionesDataSource.data = data.slice().reverse();

        this.sumTransaccionesTerminadas = data
          .filter((t: any) => t.estado_transaccion_id === 3)
          .reduce((acc: number, t: any) => acc + t.monto, 0);

        this.renderTerminadasChart();

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        // filtramos y sumamos
        this.sumTransaccionesTerminadasMes = data
          .filter((t: any) => {
            // solo estado = 3
            if (t.estado_transaccion_id !== 3) return false;
            // fecha actualización en mes&año actuales
            const d = new Date(t.fecha_actualizacion);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          })
          .reduce((acc: number, t: any) => acc + t.monto, 0);

      },
      error: err => console.error('Error cargando historial de transacciones', err)
    });

    this.loadBoletas();
  }

  ngAfterViewInit() {
    this.historialTransaccionesDataSource.paginator = this.paginator;
    this.historialTransaccionesDataSource.sort = this.sort;
  }

  loadBoletas(): void {
    this.boletasService.getBoletas().subscribe({
      next: (boletas: any[]) => {
        // meta = suma de TODOS los montos
        this.goalTotalBoletas = boletas.reduce((acc, b) => acc + (b.total ?? 0), 0);

        // pagado = estado_id === 2
        this.sumPagadoBoletas = boletas
          .filter(b => b.estado_id === 2)
          .reduce((acc, b) => acc + (b.total ?? 0), 0);

        // pendiente = estado_id === 1
        this.sumPendienteBoletas = boletas
          .filter(b => b.estado_id === 1)
          .reduce((acc, b) => acc + (b.total ?? 0), 0);

        const matriculasEnero = boletas.filter(b => {
          const fecha = new Date(b.fecha_vencimiento);
          const esEnero = fecha.getMonth() === 1;
          
          return esEnero && b.estado_id === 2;
        });

        // 2) Sumar su campo total
        this.totalMatriculasEnero = matriculasEnero
          .reduce((sum, b) => sum + (b.total ?? 0), 0);

        // una vez listos, renderiza tu chart
        this.renderGoalChart();
      },
      error: err => console.error('Error fetching boletas:', err)
    });
  }

  private renderGoalChart(): void {
    const canvasId = 'goalChart';

    // 1) Buscar si ya hay un Chart instanciado para este canvas
    const graficoExistente = Chart.getChart(canvasId);
    if (graficoExistente) {
      // 2) Si existe, destruirlo para liberar el canvas
      graficoExistente.destroy();
    }

    // si quieres que el “meta” sea el total de boletas
    const pendienteCalc = this.goalTotalBoletas - this.sumPagadoBoletas;

    new Chart(canvasId, {
      type: 'doughnut',
      data: {
        labels: ['Meta Total', 'Pagado', 'Pendiente'],
        datasets: [{
          data: [
            this.goalTotalBoletas,
            this.sumPagadoBoletas,
            this.sumPendienteBoletas  // o pendienteCalc
          ],
          backgroundColor: [
            'rgba(54,162,235,0.6)',
            'rgba(75,192,192,0.6)',
            'rgba(255,99,132,0.6)'
          ],
          borderColor: [
            'rgba(54,162,235,1)',
            'rgba(75,192,192,1)',
            'rgba(255,99,132,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => {
                const val = ctx.parsed;
                const total = this.goalTotalBoletas;
                const pct = total ? ((val / total) * 100).toFixed(1) : '0';
                return `${ctx.label}: ${val.toLocaleString('es-CL')} (${pct}%)`;
              }
            }
          }
        }
      }
    });
  }

  /** Grafico mensual pendiente vs pagado, y calculo total pagado */
  private loadChart3(): void {
    const fecha = this.getTodayString();
    this.boletasService.getTotalPendientePorMes(fecha).subscribe(pendienteData => {
      this.boletasService.getTotalPagadoPorMes(fecha).subscribe((pagadoData: TotalPagadoMes[]) => {
        this.renderChart3(pendienteData, pagadoData);
        this.sumBoletasPagadas = pagadoData.reduce((acc, p) => acc + +p.total_pagado, 0);
        // Una vez tengo totales anuales, dibujo los charts anuales
        this.renderAnnualPie();
      });
    });
  }

  /** Grafica un bar chart con sumTransaccionesTerminadas */
  private renderTerminadasChart(): void {
    new Chart('terminadasChart', {
      type: 'bar',
      data: {
        labels: ['Terminadas'],
        datasets: [{
          label: 'Monto Terminadas (CLP)',
          data: [this.sumTransaccionesTerminadas],
          backgroundColor: ['rgba(75, 192, 192, 0.6)'],
          borderColor: ['rgba(75, 192, 192, 1)'],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  /** Bar chart mensual */
  private renderChart3(pendienteData: any[], pagadoData: any[]): void {
    const labels = pendienteData.map(i => this.convertDateToMonthName(i.mes));
    const pendienteVal = pendienteData.map(i => i.total_pendiente_vencido);
    const pagadoVal = pagadoData.map(i => i.total_pagado);

    new Chart('myChart3', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Pendiente Vencido',
            data: pendienteVal,
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1
          },
          {
            label: 'Total Pagado',
            data: pagadoVal,
            backgroundColor: 'rgba(54,162,235,0.2)',
            borderColor: 'rgba(54,162,235,1)',
            borderWidth: 1
          }
        ]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }

  /** Line chart % pagado mensual */
  private renderChart4(): void {
    const pctLabels = this.porcentajes.map(p => this.convertDateToMonthName(p.mes));
    const pctVals = this.porcentajes.map(p => p.porcentaje);

    new Chart('myChart4', {
      type: 'line',
      data: {
        labels: pctLabels,
        datasets: [{
          label: 'Porcentaje Pagado',
          data: pctVals,
          fill: false,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });
  }

  private renderAnnualPie(): void {

    const id = 'annualPieChart';
    // destruye si ya existía
    const prev = Chart.getChart(id);
    if (prev) prev.destroy();

    // valores correctos en el orden de tus labels
    const pendiente = this.sumPendienteBoletas;
    const pagado = this.sumPagadoBoletas;
    const total = pendiente + pagado;

    new Chart(id, {
      type: 'pie',
      data: {
        labels: ['Pendiente', 'Pagado'],
        datasets: [{
          data: [pendiente, pagado],
          // colores en el mismo orden: primero Pendiente, luego Pagado
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',    // rojo → Pendiente
            'rgba(54, 162, 235, 0.6)'     // azul → Pagado
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: ctx => {
                const val = ctx.parsed;
                // ahora sí val/total * 100
                const pct = total
                  ? ((val / total) * 100).toFixed(1)
                  : '0';
                return `${ctx.label}: ${pct}% ($ ${val.toLocaleString('es-CL')})`;
              }
            }
          }
        }
      }
    });

    this.renderGoalChart();
  }

  /** Elige fecha según estado: pendiente → creación, otro → actualización */
  getFechaTransaccion(t: any): string {
    const raw = t.estado_transaccion_id === 1
      ? t.fecha_creacion
      : t.fecha_actualizacion;
    return new Date(raw).toISOString();
  }

  /** Clase del pill del estado */
  getEstadoClass(id: number): 'verde' | 'amarillo' | 'rojo' {
    if (id === 3) return 'verde';      // Terminada
    if (id === 1) return 'amarillo';   // Pendiente
    return 'rojo';                     // Rechazada u otros
  }

  /** Abrir detalle transacción */
  verDetalleTransaccion(t: any): void {
    console.log('Detalle de transacción', t);
  }

  /** Abrir modal de boletas */
  verBoletas(m: ResumenApoderadoMorosoDto): void {
    this.bottomSheet.open(ModalVerBoletasComponent, {
      data: {
        apoderadoId: m.rut.split('-')[0],
        nombre: m.nombre
      }
    });
  }

  /** YYYY-MM-DD de hoy */
  private getTodayString(): string {
    const d = new Date();
    const yy = d.getFullYear();
    const mm = ('0' + (d.getMonth() + 1)).slice(-2);
    const dd = ('0' + d.getDate()).slice(-2);
    return `${yy}-${mm}-${dd}`;
  }

  /** Convierte "YYYY-MM" a nombre de mes en español */
  private convertDateToMonthName(dateString: string): string {
    const [year, month] = dateString.split('-');
    const d = new Date(+year, +month - 1, 1);
    return d.toLocaleDateString('es-CL', { month: 'long' });
  }
}

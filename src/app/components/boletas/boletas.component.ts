import { Component, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { MatTableDataSource } from '@angular/material/table';
import { BoletaDetalle } from 'src/app/interfaces/boletaInterface';
import { InfoApoderadoService } from 'src/app/services/apoderadoService/infoApoderado.service';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { Router } from '@angular/router';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-boletas',
  templateUrl: './boletas.component.html',
  styleUrls: ['./boletas.component.css']
})
export class BoletasComponent implements OnInit {

  vars = [
    {
      name: 'Saldo Final del Banco Mes Anterior',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Total Ingresos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Total Costos y Gastos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Total Costos de Explotación',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Total Gastos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Aumento y Disminución de Activos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Aumento y Disminución de Pasivos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Saldo Final del Banco',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    }
  ]
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'rut_apoderado', 'detalle', 'fecha_vencimiento', 'estado_id', 'descuento', 'subtotal', 'total', 'nota'];
  dataSource = new MatTableDataSource<BoletaDetalle>();

  constructor(
    private router: Router,
    public apoderadoService: InfoApoderadoService,
    public estudianteService: EstudianteService,
    public boletasService: BoletasService
  ) { }

  ngOnInit(): void {
    //this.loadChart();
    this.loadBoletas();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadBoletas(): void {
    this.boletasService.getBoletas().subscribe({
      next: (boletas: BoletaDetalle[]) => {
        this.dataSource.data = boletas;
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });
  }


  loadChart(): void {
    const myChart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Saldos Caja',
          data: [65, 59, 80, 81, 56, 55, 40],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    //chart 2
    const myChart2 = new Chart('myChart2', {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Gasto Mensual',
          data: [14, 12, 13, 11, 12, 13, 14],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }

}

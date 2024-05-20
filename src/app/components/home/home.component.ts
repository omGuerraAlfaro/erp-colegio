import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { InfoAdmService } from 'src/app/services/administradorService/infoAdm.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  vars = [
    {
      name: 'Monto Adeudado Mes',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Monto Adeudado Total',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Numero de Morosos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Curso con mas Morosos',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
    {
      name: 'Monto recaudado Mes',
      mount: 1000000,
      date: '2021-01-01',
      link: 'flujo-efectivo'
    },
  ]

  nameUser: any;
  constructor(private admService: InfoAdmService) { }

  ngOnInit(): void {
    this.loadChart();
    this.admService.getInfoAdm(localStorage.getItem('rutAmbiente')).subscribe({
      next: (data) => {
        console.log(data);
        this.nameUser = data[0].primer_nombre + ' ' + data[0].primer_apellido + ' ' + data[0].segundo_apellido;
      },
      error: (error) => {
        console.error("Error al obtener datos:", error);
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


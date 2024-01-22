import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  vars = [
    {
      name: 'Saldo Anterior Caja Anterior',
      mount: 1000000,
      date: '2023-03-24',
      link: 'flujo-caja'
    },
    {
      name: 'Ingresos Menos Costos y Gastos',
      mount: 1000000,
      date: '2023-03-24',
      link: 'flujo-caja'
    },
    {
      name: 'Total Costos y Gastos',
      mount: 1000000,
      date: '2023-03-24',
      link: 'flujo-caja'
    },
    {
      name: 'Total Costos de Explotación',
      mount: 1000000,
      date: '2023-03-24',
      link: 'flujo-caja'
    }
  ]

  constructor() { }

  ngOnInit(): void {
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


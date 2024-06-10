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
      name: 'Gestionar Profesores',
      link: 'profesores',
      icon: 'fas fa-chalkboard-teacher',
      color: 'bg-blue'
    },
    {
      name: 'Gestionar Apoderados',
      link: 'apoderados',
      icon: 'fas fa-user-friends',
      color: 'bg-green'
    },
    {
      name: 'Gestionar Estudiantes',
      link: 'estudiantes',
      icon: 'fas fa-user-graduate',
      color: 'bg-yellow'
    },
    {
      name: 'Gestionar Cursos',
      link: 'cursos',
      icon: 'fas fa-book',
      color: 'bg-red'
    },
    {
      name: 'Gestionar Roles',
      link: 'roles',
      icon: 'fas fa-id-badge',
      color: 'bg-darkblue'
    },
    {
      name: 'Gestionar Asignaturas',
      link: 'asignaturas',
      icon: 'fas fa-book-open',
      color: 'bg-lightblue'
    },
    {
      name: 'Gestionar Notas',
      link: 'notas',
      icon: 'fas fa-clipboard-list',
      color: 'bg-darkgrey'
    },
    {
      name: 'Gestionar Calendario',
      link: 'calendario',
      icon: 'fas fa-calendar-alt',
      color: 'bg-lightblue'
    }
  ];
  

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

  getCardColor(cardName: string): string {
    switch (cardName) {
      case 'Gestionar Profesores':
        return 'bg-blue';
      case 'Gestionar Apoderados':
        return 'bg-green';
      case 'Gestionar Estudiantes':
        return 'bg-yellow';
      case 'Gestionar Cursos':
        return 'bg-red';
      case 'Gestionar Administrativos':
        return 'bg-grey';
      case 'Gestionar Roles':
        return 'bg-darkblue';
      case 'Gestionar Asignaturas':
        return 'bg-lightblue';
      case 'Gestionar Notas':
        return 'bg-darkgrey';
      case 'Gestionar Calendario':
        return 'bg-orange';
      default:
        return 'bg-default';
    }
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


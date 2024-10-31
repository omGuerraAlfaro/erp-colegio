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
      name: 'Gestionar Matriculas',
      link: 'matriculas',
      icon: 'fas fa-id-badge',
      color: 'bg-green',
      roles: ['administrador']
    },
    {
      name: 'Gestionar Profesores',
      link: 'profesores',
      icon: 'fas fa-chalkboard-teacher',
      color: 'bg-blue',
      roles: ['administrador']
    },
    {
      name: 'Gestionar Estudiantes',
      link: 'estudiantes',
      icon: 'fas fa-user-graduate',
      color: 'bg-yellow',
      roles: ['administrador']
    },
    {
      name: 'Gestionar Apoderados',
      link: 'roles',
      icon: 'fas fa-user-friends',
      color: 'bg-darkblue',
      roles: ['administrador']
    },
    {
      name: 'Gestionar Cursos',
      link: 'cursos',
      icon: 'fas fa-book',
      color: 'bg-red',
      roles: ['administrador']
    },
    {
      name: 'Gestionar Calendario',
      link: 'calendario',
      icon: 'fas fa-calendar-alt',
      color: 'bg-lightblue',
      roles: ['administrador']
    },
    {
      name: 'Gestionar Asignaturas',
      link: 'asignaturas',
      icon: 'fas fa-book-open',
      color: 'bg-lightblue',
      roles: ['profesor']
    },
    {
      name: 'Gestionar Notas',
      link: 'notas',
      icon: 'fas fa-clipboard-list',
      color: 'bg-darkgrey',
      roles: ['profesor']
    },
    {
      name: 'Gestionar Anotaciones',
      link: 'anotaciones',
      icon: 'fas fa-clipboard-list',
      color: 'bg-yellow',
      roles: ['profesor']
    }
  ];

  filteredVars: any[] = [];
  nameUser: any;
  rolUser: any;
  rutUser: any;

  constructor(private admService: InfoAdmService) { }

  ngOnInit(): void {
    this.rolUser = localStorage.getItem('rol');
    this.rutUser = localStorage.getItem('rutAmbiente');
    if (this.rolUser === 'administrador') {
      this.admService.getInfoAdm(this.rutUser).subscribe({
        next: (data) => {
          console.log(data);
          
          this.nameUser = `${data.primer_nombre} ${data.primer_apellido} ${data.segundo_apellido}`;
        },
        error: (error) => {
          console.error("Error al obtener datos:", error);
        }
      });
    } else if (this.rolUser === 'profesor') {
      this.admService.getInfoProfesor(this.rutUser).subscribe({
        next: (data) => {
          this.nameUser = `${data.primer_nombre} ${data.primer_apellido}`;
        },
        error: (error) => {
          console.error("Error al obtener datos:", error);
        }
      });
    }

    this.filteredVars = this.vars.filter(v => v.roles.includes(this.rolUser));
    this.loadChart();
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

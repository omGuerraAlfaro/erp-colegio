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
      roles: ['administrador', 'subAdministrador', 'profesor-utp']
    },
    {
      name: 'Gestionar Profesores',
      link: 'profesores',
      icon: 'fas fa-chalkboard-teacher',
      color: 'bg-blue',
      roles: ['administrador', 'profesor-utp']
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
      link: 'calendario-escolar',
      icon: 'fas fa-calendar-alt',
      color: 'bg-red',
      roles: ['administrador', 'subAdministrador', 'profesor', 'profesor-utp']
    },
    {
      name: 'Gestionar Asignaturas',
      link: 'cursos-asignaturas',
      icon: 'fas fa-book-open',
      color: 'bg-lightblue',
      roles: ['administrador', 'subAdministrador', 'profesor-utp']
    },
    {
      name: 'Gestionar Notas',
      link: 'cursos-notas',
      icon: 'fas fa-clipboard-list',
      color: 'bg-darkgrey',
      roles: ['administrador', 'subAdministrador', 'profesor', 'profesor-utp']
    },
    {
      name: 'Gestionar Anotaciones',
      link: 'cursos-anotaciones',
      icon: 'fas fa-clipboard-list',
      color: 'bg-yellow',
      roles: ['administrador', 'subAdministrador', 'profesor', 'profesor-utp', 'profesor-pae']
    },
    {
      name: 'Gestionar Asistencia',
      link: 'cursos-asistencia',
      icon: 'fas fa-clipboard-list',
      color: 'bg-darkblue',
      roles: ['administrador', 'subAdministrador', 'profesor', 'profesor-utp']
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
          this.nameUser = `${data.primer_nombre} ${data.primer_apellido} ${data.segundo_apellido}`;
        },
        error: (error) => {
          console.error("Error al obtener datos:", error);
        }
      });
    } else if (this.rolUser === 'subAdministrador') {
      this.admService.getInfoSubAdm(this.rutUser).subscribe({
        next: (data) => {
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
    } else if (this.rolUser === 'profesor-utp') {
      this.admService.getInfoProfesor(this.rutUser).subscribe({
        next: (data) => {
          this.nameUser = `${data.primer_nombre} ${data.primer_apellido}`;
        },
        error: (error) => {
          console.error("Error al obtener datos:", error);
        }
      });
    } else if (this.rolUser === 'profesor-pae') {
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
  }
}

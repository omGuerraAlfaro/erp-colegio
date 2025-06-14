import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { InfoAdmService } from 'src/app/services/administradorService/infoAdm.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  isLogged = false;
  before: any;
  isMatriculasOpen = false;
  isFinanzasOpen = false;
  isAdministacionOpen = false;
  isProfesorOpen = false;
  constructor(
    private auth: AuthService,
    private admService: InfoAdmService,
    private router: Router,
    private activeroute: ActivatedRoute
  ) { }

  rut: any;
  nombreUser: any;
  genderUser: any;
  rolUser: any;
  ngOnInit(): void {
    this.rolUser = localStorage.getItem('rol');
    this.rut = localStorage.getItem('rutAmbiente');
    this.rolUser = localStorage.getItem('rol');
    this.genderUser = localStorage.getItem('genero');
    if (this.rolUser === 'administrador') {
      this.admService.getInfoAdm(localStorage.getItem('rutAmbiente')).subscribe({
        next: (data) => {
          this.nombreUser = data.primer_nombre + ' ' + data.primer_apellido + ' ' + data.segundo_apellido;
        },
        error: (error) => {
          console.error("Error al obtener datos:", error);
        }
      });
    }
    if (this.rolUser === 'subAdministrador') {
      this.admService.getInfoSubAdm(localStorage.getItem('rutAmbiente')).subscribe({
        next: (data) => {
          this.nombreUser = data.primer_nombre + ' ' + data.primer_apellido + ' ' + data.segundo_apellido;
          console.log(this.genderUser);

        },
        error: (error) => {
          console.error("Error al obtener datos:", error);
        }
      });
    }
    if (this.rolUser === 'profesor') {
      this.admService.getInfoProfesor(localStorage.getItem('rutAmbiente')).subscribe({
        next: (data) => {
          this.nombreUser = data.primer_nombre + ' ' + data.primer_apellido;
        },
        error: (error) => {
          console.error("Error al obtener datos:", error);
        }
      });
    } else if (this.rolUser === 'profesor-utp') {
      this.admService.getInfoProfesor(localStorage.getItem('rutAmbiente')).subscribe({
        next: (data) => {
          this.nombreUser = data.primer_nombre + ' ' + data.primer_apellido;
        },
        error: (error) => {
          console.error("Error al obtener datos:", error);
        }
      });
    } else if (this.rolUser === 'profesor-pae') {
      this.admService.getInfoProfesor(localStorage.getItem('rutAmbiente')).subscribe({
        next: (data) => {
          this.nombreUser = data.primer_nombre + ' ' + data.primer_apellido;
        },
        error: (error) => {
          console.error("Error al obtener datos:", error);
        }
      });
    }
  }


  logout() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.auth.logout();
        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  toggleMatriculas() {
    if (!this.isMatriculasOpen) {
      this.isMatriculasOpen = true;
      this.isFinanzasOpen = false;
      this.isAdministacionOpen = false;
      this.isProfesorOpen = false;
    } else {
      this.isMatriculasOpen = false;
    }
  }

  toggleFinanzas() {
    if (!this.isFinanzasOpen) {
      this.isFinanzasOpen = true;
      this.isMatriculasOpen = false;
      this.isAdministacionOpen = false;
      this.isProfesorOpen = false;
    } else {
      this.isFinanzasOpen = false;
    }
  }

  toggleAdm() {
    if (!this.isAdministacionOpen) {
      this.isAdministacionOpen = true;
      this.isMatriculasOpen = false;
      this.isFinanzasOpen = false;
      this.isProfesorOpen = false;
    } else {
      this.isAdministacionOpen = false;
    }
  }

  toggleProfesor() {
    if (!this.isProfesorOpen) {
      this.isProfesorOpen = true;
      this.isMatriculasOpen = false;
      this.isFinanzasOpen = false;
      this.isAdministacionOpen = false;
    } else {
      this.isProfesorOpen = false;
    }
  }




}

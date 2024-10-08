import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { InfoAdmService } from 'src/app/services/administradorService/infoAdm.service';
import { AuthService } from 'src/app/services/auth.service';
import { VtigerService } from 'src/app/services/vtiger.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService,
    private datav: VtigerService,
    private admService: InfoAdmService
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
    if(this.rolUser === 'administrador'){
      this.admService.getInfoAdm(localStorage.getItem('rutAmbiente')).subscribe({
        next: (data) => {
          console.log(data);
          this.nombreUser = data.primer_nombre + ' ' + data.primer_apellido + ' ' + data.segundo_apellido;
          console.log(this.genderUser);
          
        },
        error: (error) => {
          console.error("Error al obtener datos:", error);
        }
      });
    }
    if(this.rolUser === 'profesor'){
      this.admService.getInfoProfesor(localStorage.getItem('rutAmbiente')).subscribe({
        next: (data) => {
          console.log(data);
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
      text: '¿Deseas Cerrar Sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Cerrar Sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        localStorage.clear();
        localStorage.setItem('ingresado', 'false');
        this.router.navigate(['/login']);
        location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }




}

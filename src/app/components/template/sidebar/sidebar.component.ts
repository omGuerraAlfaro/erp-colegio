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

  constructor(private router: Router, private auth: AuthService, private datav: VtigerService, private admService: InfoAdmService) { }

  rut: any;
  nombreUser: any;
  countVtiger: any;
  idCategorizados: any[] = [];
  dataVtiger: any;
  ngOnInit(): void {
    this.rut = localStorage.getItem('rutAmbiente');
    this.admService.getInfoAdm(localStorage.getItem('rutAmbiente')).subscribe({
      next: (data) => {
        console.log(data);
        this.nombreUser = data[0].primer_nombre + ' ' + data[0].primer_apellido + ' ' + data[0].segundo_apellido;
        console.log(this.nombreUser);
        
      },
      error: (error) => {
        console.error("Error al obtener datos:", error);
      }
    });
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
        localStorage.setItem('ingresado', 'false');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('rutAmbiente');
        localStorage.removeItem('rutApoderado');
        localStorage.removeItem('email');
        this.router.navigate(['/login']);
        location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }




}

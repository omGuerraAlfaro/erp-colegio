import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { VtigerService } from 'src/app/services/vtiger.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService, private datav: VtigerService) { }

  countVtiger: any;
  idCategorizados: any[] = [];
  dataVtiger: any;
  ngOnInit(): void {
    
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

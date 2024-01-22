import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { VtigerService } from 'src/app/services/vtiger.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService, private datav: VtigerService, public data: CategoryService) { }

  countVtiger: any;
  idCategorizados: any[] = [];
  dataVtiger: any;
  ngOnInit(): void {

    /* SE OBTIENEN LOS MOVIMIENTOS PROVENIENTES DE VTIGER, 
    SE COMPARAN CON LOS MOVIMIENTOS YA CATEGORIZADOS EN EL LIBRO DE BANCO
    ESTA DATA SE CUENTA PARA MOSTAR LA CANTIDAD DE MOVIMIENTOS NO CATEGORIZADOS. */
    forkJoin({
      movimientosCategorizados: this.data.getMovimientosCategorizados(),
      movInfo: this.datav.getMovInfo(),
    }).subscribe(({ movimientosCategorizados, movInfo }) => {
      const cadena = movimientosCategorizados.map((item: any) => item.id_mov);
      const miCadena: string = cadena.join(",");
      this.idCategorizados.push(miCadena);
      const idsArray = this.idCategorizados[0].split(',');
      this.dataVtiger = movInfo.filter((item: any) => !idsArray.includes(item.invoice_no));
      this.countVtiger = this.dataVtiger.length;
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

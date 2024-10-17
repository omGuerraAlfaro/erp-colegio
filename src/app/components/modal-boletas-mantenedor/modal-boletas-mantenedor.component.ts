import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import { InfoApoderadoService } from 'src/app/services/apoderadoService/infoApoderado.service';
import { BoletaDetalle } from 'src/app/interfaces/boletaInterface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-boletas-mantenedor',
  templateUrl: './modal-boletas-mantenedor.component.html',
  styleUrls: ['./modal-boletas-mantenedor.component.css']
})
export class ModalBoletasMantenedorComponent implements OnInit {
editarBoleta(arg0: any) {
throw new Error('Method not implemented.');
}
verBoletas(arg0: any) {
throw new Error('Method not implemented.');
}

  displayedColumns: string[] = ['id', 'rut_apoderado', 'rut_estudiante', 'detalle', 'total', 'acciones'];
  dataSource!: MatTableDataSource<BoletaDetalle>;
  
  // Variable global para almacenar datos del apoderado
  apoderado: any;

  constructor(
    private boletaService: BoletasService,
    private apoderadoService: InfoApoderadoService,
    private dialogRef: MatDialogRef<ModalBoletasMantenedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.boletaService.getBoletasByRutApoderado(this.data).subscribe({
      next: (boletas: BoletaDetalle[]) => {
        console.log(boletas);
        
        this.dataSource = new MatTableDataSource(boletas);
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });

    this.apoderadoService.getInfoApoderado(this.data).subscribe({
      next: (apoderado: any) => {
        this.apoderado = apoderado; // Guardar datos del apoderado
        console.log(apoderado);
        
      },
      error: (error) => {
        console.error('Error fetching apoderado:', error);
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}


  // onSubmit(): void {
  //   if (this.anotacionForm.valid) {
  //     const anotacionData = this.anotacionForm.value;
  //     const idEstudiante = this.data.id;

  //     if (anotacionData.asignaturaId != null) {
  //       anotacionData.asignaturaId = Number(anotacionData.asignaturaId);
  //     }

  //     this.estudianteService.postNuevaAnotacion(idEstudiante, anotacionData)
  //       .subscribe(
  //         response => {
  //           Swal.fire({
  //             title: 'Éxito!',
  //             text: 'La anotación se ha creado correctamente.',
  //             icon: 'success',
  //             confirmButtonText: 'OK'
  //           }).then(() => {
  //             this.dialogRef.close();
  //           });
  //         },
  //         error => {
  //           Swal.fire({
  //             title: 'Error!',
  //             text: 'Hubo un problema al crear la anotación.',
  //             icon: 'error',
  //             confirmButtonText: 'OK'
  //           });
  //         }
  //       );
  //   } else {
  //     Swal.fire({
  //       title: 'Formulario incompleto',
  //       text: 'Por favor, complete todos los campos requeridos.',
  //       icon: 'warning',
  //       confirmButtonText: 'OK'
  //     });
  //   }
  // }

import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import { InfoApoderadoService } from 'src/app/services/apoderadoService/infoApoderado.service';
import { BoletaDetalle } from 'src/app/interfaces/boletaInterface';
import Swal from 'sweetalert2';
import { EditBoletaComponent } from './edit-boleta/edit-boleta.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CreateBoletaComponent } from './create-boleta/create-boleta.component';

@Component({
  selector: 'app-modal-boletas-mantenedor',
  templateUrl: './modal-boletas-mantenedor.component.html',
  styleUrls: ['./modal-boletas-mantenedor.component.css']
})
export class ModalBoletasMantenedorComponent implements OnInit {
  displayedColumns: string[] = ['id', 'detalle', 'total', 'fecha_vencimiento', 'estado_boleta', 'acciones'];
  dataSource: { [key: number]: MatTableDataSource<BoletaDetalle> } = {}; // Updated to store grouped data

  // Variable global para almacenar datos del apoderado
  apoderado: any;

  constructor(
    private boletaService: BoletasService,
    private apoderadoService: InfoApoderadoService,
    private dialogRef: MatDialogRef<ModalBoletasMantenedorComponent>,
    private bottomSheet: MatBottomSheet,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.boletaService.getBoletasByRutApoderado(this.data).subscribe({
      next: (boletas: BoletaDetalle[]) => {
        console.log(boletas);
        this.groupBoletasByEstudiante(boletas); // Grouping boletas
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

  groupBoletasByEstudiante(boletas: BoletaDetalle[]) {
    this.dataSource = boletas.reduce((acc, boleta) => {
      if (!acc[boleta.estudiante_id]) {
        acc[boleta.estudiante_id] = new MatTableDataSource();
      }
      if (!acc[boleta.estudiante_id].data) {
        acc[boleta.estudiante_id].data = [];
      }
      acc[boleta.estudiante_id].data.push(boleta);
      return acc;
    }, {} as { [key: number]: MatTableDataSource<BoletaDetalle> });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  editarBoleta(element: any) {
    const bottomSheetRef = this.bottomSheet.open(EditBoletaComponent, {
      data: element // Pasa el elemento a editar
    });

    bottomSheetRef.afterDismissed().subscribe((result) => {
      console.log(result);
      if (result) {
        this.ngOnInit();
      }
    });
  }

  crearBoletas() {
    const bottomSheetRef = this.bottomSheet.open(CreateBoletaComponent, {
      data: this.apoderado
    });

    bottomSheetRef.afterDismissed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  editarBoleta2(element: any): void {
    // Cambia el estado de la boleta
    const nuevoEstado = !element.estado_boleta;

    const boletaActualizada = {
      ...element,
      estado_boleta: nuevoEstado
    };

    this.boletaService.editarBoletaAll(boletaActualizada.id, boletaActualizada).subscribe({
      next: (response) => {
        console.log('Estado de Boleta modificada con éxito:', response);
        Swal.fire({
          title: 'Éxito',
          text: 'El estado de la boleta ha sido modificado correctamente.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error al editar la boleta:', error);

        Swal.fire({
          title: 'Error',
          text: 'No se pudo editar la boleta. Inténtalo de nuevo más tarde.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
}

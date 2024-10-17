import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoletaDetalle } from 'src/app/interfaces/boletaInterface';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-boletas-estudiante',
  templateUrl: './modal-boletas-estudiante.component.html',
  styleUrls: ['./modal-boletas-estudiante.component.css']
})
export class ModalBoletasEstudianteComponent implements OnInit {
  @Output() boletaEditada = new EventEmitter<void>();

  boleta!: BoletaDetalle[];
  displayedColumns: string[] = ['id', 'detalle', 'fecha_vencimiento', 'total', 'estado', 'actions'];
  nameEstudent='';

  constructor(
    public dialogRef: MatDialogRef<ModalBoletasEstudianteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private estudianteService: EstudianteService,
    private readonly boletasService: BoletasService
  ) { 
    console.log(data);

  }

  ngOnInit() {
    this.loadBoletas();
  }

  loadBoletas() {
    const rutParts = this.data.rut_estudiante.split('-')[0];
    this.boletasService.getBoletasByRutEstudiante(rutParts).subscribe({
      next: (dataBoleta: BoletaDetalle[]) => {
        this.boleta = dataBoleta.map(boleta => ({
          ...boleta,
          fecha_vencimiento: this.formatFechaVencimiento(boleta.fecha_vencimiento)
        }));
        console.log(this.boleta);
        
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });
    this.estudianteService.getInfoEstudiante(rutParts).subscribe({
      next: (data) => {
        console.log(data);
        
        this.nameEstudent = data.primer_nombre_alumno + ' ' + data.primer_apellido_alumno;
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });
  }

  formatFechaVencimiento(fecha: string): string {
    const fechaVencimiento = new Date(fecha);
    return fechaVencimiento.toISOString().split('T')[0];
  }

  getEstadoBoleta(estadoId: number): string {
    switch (estadoId) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Pagada';
      case 4:
        return 'Repactada';
      case 5:
        return 'Transferencia Pendiente';
      case 6:
        return 'Transferencia Aprobada';
      default:
        return 'Desconocido';
    }
  }

  getEstadoBoletaClass(estadoId: number): string {
    switch (estadoId) {
      case 1:
        return 'estado-pendiente';
      case 2:
        return 'estado-pagada';
      case 4:
        return 'estado-repactada';
      case 5:
        return 'estado-transferenciaPendiente';
      case 6:
        return 'estado-transferenciaAprobada';
      default:
        return '';
    }
  }

  editarBoleta(id: number, butOrder: string) {
    Swal.fire({
      title: 'Seleccione el nuevo estado para boleta N°' + id,
      input: 'select',
      inputOptions: {
        '1': 'Pendiente',
        '2': 'Pagada',
        '4': 'Repactada',
        '5': 'Transferencia Pendiente',
        '6': 'Transferencia Aprobada',
      },
      inputPlaceholder: 'Seleccione un estado',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        const estado = Number(result.value);
        const dataUpdate = {
          idBoleta: id,
          estado: estado,
          idPago: butOrder
        };
        console.log(dataUpdate);
        this.boletasService.editarBoleta(dataUpdate).subscribe({
          next: (boleta: any) => {
            console.log(boleta);
            Swal.fire('Éxito', 'Boleta actualizada correctamente', 'success');
            this.loadBoletas(); // Recargar las boletas
            this.boletaEditada.emit();
          },
          error: (error) => {
            console.error('Error actualizando boleta:', error);
            Swal.fire('Error', 'No se pudo actualizar la boleta', 'error');
          }
        });
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

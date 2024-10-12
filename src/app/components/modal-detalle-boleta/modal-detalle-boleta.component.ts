import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IEstudiante } from 'src/app/interfaces/apoderadoInterface';
import { BoletasService } from 'src/app/services/boletasService/boletas.service';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-detalle-boleta',
  templateUrl: './modal-detalle-boleta.component.html',
  styleUrls: ['./modal-detalle-boleta.component.css']
})
export class ModalDetalleBoletaComponent implements OnInit {
  @Output() boletaEditada = new EventEmitter<void>();


  estudiante!: IEstudiante;
  estado!: number;
  buy_order: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalDetalleBoletaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private estudianteService: EstudianteService,
    private readonly boletasService: BoletasService
  ) { }

  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.estudianteService.getInfoEstudiante(this.data.rut_estudiante).subscribe({
      next: (dataEstudiante: IEstudiante) => {
        this.estudiante = dataEstudiante;
        console.log(this.estudiante);
        
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });
  }

  editarBoleta(id: number, butOrder: string) {
    Swal.fire({
      title: 'Seleccione el nuevo estado para boleta N°' + id,
      input: 'select',
      inputOptions: {
        '1': 'Pendiente',
        '2': 'Pagada',
        '3': 'Repactada',
        '5': 'Transferencia Pendiente',
        '6': 'Transferencia Aprobada',
      },
      inputPlaceholder: 'Seleccione un estado',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.estado = Number(result.value);
        const dataUpdate = {
          idBoleta: id,
          estado: this.estado,
          idPago: butOrder
        };
        console.log(dataUpdate);
        this.boletasService.editarBoleta(dataUpdate).subscribe({
          next: (boleta: any) => {
            console.log(boleta);
            Swal.fire('Éxito', 'Boleta actualizada correctamente', 'success');
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

  confirmarPagoTransferencia() { }
}

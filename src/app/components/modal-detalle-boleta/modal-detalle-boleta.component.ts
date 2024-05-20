import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IEstudiante } from 'src/app/interfaces/apoderadoInterface';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';

@Component({
  selector: 'app-modal-detalle-boleta',
  templateUrl: './modal-detalle-boleta.component.html',
  styleUrls: ['./modal-detalle-boleta.component.css']
})
export class ModalDetalleBoletaComponent implements OnInit {

  estudiante!: IEstudiante;

  constructor(
    public dialogRef: MatDialogRef<ModalDetalleBoletaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private estudianteService: EstudianteService,
  ) { }

  closeModal(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.estudianteService.getInfoEstudiante(this.data.rut_estudiante).subscribe({
      next: (dataEstudiante: IEstudiante) => {
        this.estudiante = dataEstudiante;
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });
  }

  editarBoleta(){}

  confirmarPagoTransferencia(){}
}

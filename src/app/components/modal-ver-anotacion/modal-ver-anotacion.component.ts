import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';

@Component({
  selector: 'app-modal-ver-anotacion',
  templateUrl: './modal-ver-anotacion.component.html',
  styleUrls: ['./modal-ver-anotacion.component.css']
})
export class ModalVerAnotacionComponent implements OnInit {
  annotations: any[] = [];
  estudiante: { nombre: string, rut: string, telefono: string, genero: string } | null = null;

  constructor(
    private estudianteService: EstudianteService,
    private dialogRef: MatDialogRef<ModalVerAnotacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data);
    this.estudiante = {
      nombre: this.data.nombre_estudiante,
      rut: this.data.rut_estudiante2,
      telefono: this.data.telefono_estudiante,
      genero: this.data.genero_estudiante
    };
    
  }

  ngOnInit(): void {
    this.fetchAnnotations();
  }

  fetchAnnotations(): void {
    this.estudianteService.getAnotaciones(this.data.id).subscribe(
      (data: any) => {
        this.annotations = data;
      },
      error => {
        console.error('Error fetching annotations', error);
      }
    );
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

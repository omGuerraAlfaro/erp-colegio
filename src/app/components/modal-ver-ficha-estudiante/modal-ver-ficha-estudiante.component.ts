import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InfoApoderadoService } from 'src/app/services/apoderadoService/infoApoderado.service';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';

@Component({
  selector: 'app-modal-ver-ficha-estudiante',
  templateUrl: './modal-ver-ficha-estudiante.component.html',
  styleUrls: ['./modal-ver-ficha-estudiante.component.css']
})


export class ModalVerFichaEstudianteComponent implements OnInit {
  estudiante: any;
  constructor(
    private estudianteService: EstudianteService,
    private dialogRef: MatDialogRef<ModalVerFichaEstudianteComponent>,
    
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    const rut = this.data.rut.split('-')[0];
    
    this.estudianteService.getInfoEstudianteConApoderados(rut).subscribe({
      next: (data: any) => {
        this.estudiante = data;
        console.log(this.estudiante);
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

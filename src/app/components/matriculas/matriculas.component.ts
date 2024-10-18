import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { ModalIngresarMatriculaComponent } from '../modal-ingresar-matricula/modal-ingresar-matricula.component';

@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit {
  totalEstudiantes: number = 0;
  totalHombres: number = 0;
  totalMujeres: number = 0;

  constructor(public dialog: MatDialog, private estudianteService: EstudianteService) { }

  ngOnInit(): void {
    this.estudianteService.getCountByGenero().subscribe(data => {
      this.totalHombres = data.masculinoCount;
      this.totalMujeres = data.femeninoCount;
      this.totalEstudiantes = this.totalHombres + this.totalMujeres;
    });
  }

  openModalNuevaMatricula() {
    const dialogRef = this.dialog.open(ModalIngresarMatriculaComponent, {
      width: '70%',
      height: 'auto',
    });

    dialogRef.componentInstance.inscripcionOK.subscribe(() => {
      // this.loadInscripciones();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });

  }
}

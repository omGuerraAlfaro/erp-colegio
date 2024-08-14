import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { ModalNuevaMatriculaComponent } from '../modal-nueva-matricula/modal-nueva-matricula.component';

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
    const dialogRef = this.dialog.open(ModalNuevaMatriculaComponent, {
      width: '80%',
      height: 'auto',
      data: null // por parametro
    });

    dialogRef.componentInstance.matriculaAgregada.subscribe(() => {
      // handle matricula agregada event
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });
  }
}

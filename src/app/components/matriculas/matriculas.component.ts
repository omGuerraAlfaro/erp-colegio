import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { ModalIngresarMatriculaComponent } from '../modal-ingresar-matricula/modal-ingresar-matricula.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IEstudiante2 } from 'src/app/interfaces/apoderadoInterface';

@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit {
  totalEstudiantes: number = 0;
  totalHombres: number = 0;
  totalMujeres: number = 0;
  estudiantes: MatTableDataSource<IEstudiante2> = new MatTableDataSource();
  displayedColumns: string[] = [
    'id',
    'nombreCompleto',
    'fecha_nacimiento',
    'rut',
    'genero',
    'vive_con',
    'prevision',
    'autorizacion_fotografias',
    'curso'
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(public dialog: MatDialog, private estudianteService: EstudianteService) { }


  ngOnInit(): void {
    this.iniciarContadoresAlumnos();
    this.loadEstudiantes();
  }

  ngAfterViewInit(): void {
    // Asignar el paginador aquí
    this.estudiantes.paginator = this.paginator;
  }
  loadEstudiantes(): void {
    this.estudianteService.getAllEstudiantes().subscribe(data => {
      console.log(data);

      this.estudiantes = data;  // Asignar la lista de estudiantes

    }, error => {
      console.error('Error al cargar estudiantes:', error);
    });
  }

  iniciarContadoresAlumnos(): void {
    this.estudianteService.getCountByGenero().subscribe(data => {
      this.totalHombres = data.masculinoCount;
      this.totalMujeres = data.femeninoCount;
      this.totalEstudiantes = this.totalHombres + this.totalMujeres;
    });
  }

  openModalNuevaMatricula() {
    const dialogRef = this.dialog.open(ModalIngresarMatriculaComponent, {
      width: '70%',
      height: '100%',
      maxHeight: '100%',
      panelClass: 'full-height-dialog',
    });

    dialogRef.componentInstance.inscripcionOK.subscribe(() => {
      this.iniciarContadoresAlumnos();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });

  }
}

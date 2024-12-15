import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IEstudiante2 } from 'src/app/interfaces/apoderadoInterface';
import { ModalIngresarMatriculaComponent } from '../modal-ingresar-matricula/modal-ingresar-matricula.component';
import { ModalEditEstudianteComponent } from '../modal-edit-estudiante/modal-edit-estudiante.component';

@Component({
  selector: 'app-matriculas',
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit {
  totalEstudiantes: number = 0;
  totalHombres: number = 0;
  totalMujeres: number = 0;
  displayedColumns: string[] = [
    'count',
    'id',
    'nombreCompleto',
    'rut',
    'vive_con',
    'autorizacion_fotografias',
    'estado_estudiante',
    'acciones'
  ];

  dataSourceCursos: { [key: string]: { dataSource: MatTableDataSource<IEstudiante2>, nombreCurso: string } } = {};
  hasLoadedData = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private estudianteService: EstudianteService) {}

  ngOnInit(): void {
    this.iniciarContadoresAlumnos();
    this.loadEstudiantes();
  }

  ngAfterViewInit(): void {
    Object.values(this.dataSourceCursos).forEach(course => {
      course.dataSource.paginator = this.paginator;
    });
  }

  loadEstudiantes(): void {
    this.estudianteService.getAllEstudiantes().subscribe({
      next: (estudiantes: IEstudiante2[]) => {
        const groupedByCurso = estudiantes.reduce((acc, estudiante) => {
          const cursoId = estudiante.curso[0]?.id || 'Sin Curso';
          if (!acc[cursoId]) {
            acc[cursoId] = { estudiantes: [], nombreCurso: estudiante.curso[0]?.nombre || 'Sin Curso' };
          }
          acc[cursoId].estudiantes.push(estudiante);
          return acc;
        }, {} as { [key: string]: { estudiantes: IEstudiante2[], nombreCurso: string } });

        Object.entries(groupedByCurso).forEach(([cursoId, { estudiantes, nombreCurso }]) => {
          this.dataSourceCursos[cursoId] = {
            dataSource: new MatTableDataSource<IEstudiante2>(estudiantes),
            nombreCurso
          };
        });

        this.hasLoadedData = true;
      },
      error: (error) => {
        console.error('Error al cargar estudiantes:', error);
      }
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
    const dialogRef = this.dialog.open(ModalIngresarMatriculaComponent, { width: '70%', panelClass: 'full-height-dialog' });
    dialogRef.afterClosed().subscribe(() => {
      this.iniciarContadoresAlumnos();
      this.loadEstudiantes();
    });
  }

  openModalEditEstudiante(element: any) {
    const dialogRef = this.dialog.open(ModalEditEstudianteComponent, { width: '70%', data: element });
    dialogRef.afterClosed().subscribe(() => {
      this.iniciarContadoresAlumnos();
      this.loadEstudiantes();
    });
  }

  getCursoKeys(): string[] {
    return Object.keys(this.dataSourceCursos);
  }
}

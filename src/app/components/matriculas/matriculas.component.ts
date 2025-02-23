import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IEstudiante2 } from 'src/app/interfaces/apoderadoInterface';
import { ModalIngresarMatriculaComponent } from '../modal-ingresar-matricula/modal-ingresar-matricula.component';
import { ModalEditEstudianteComponent } from '../modal-edit-estudiante/modal-edit-estudiante.component';
import { ModalIngresarMatriculaApoderadoExistComponent } from '../modal-ingresar-matricula-apoderado-exist/modal-ingresar-matricula-apoderado-exist.component';

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
        // Ajustar las fechas de cada estudiante
        estudiantes.forEach((estudiante) => {
          estudiante.fecha_nacimiento_alumno = this.adjustDate(estudiante.fecha_nacimiento_alumno);
          estudiante.fecha_matricula = this.adjustDate(estudiante.fecha_matricula);
        });
  
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
  
  adjustDate(date: string): string {
    if (!date) return '';
  
    // Convertir la fecha recibida en un objeto Date
    const localDate = new Date(date);
  
    // Sumar un día para corregir el desfase (si es necesario)
    localDate.setDate(localDate.getDate() + 1);
  
    // Retornar la fecha ajustada en formato ISO (o el formato deseado)
    return localDate.toISOString().split('T')[0]; // Retorna solo la parte de la fecha
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

  openModalNuevaMatriculaApoderadoExist() {
    const dialogRef = this.dialog.open(ModalIngresarMatriculaApoderadoExistComponent, { width: '70%', panelClass: 'full-height-dialog' });
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

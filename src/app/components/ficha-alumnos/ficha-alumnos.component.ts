import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IEstudiante2 } from 'src/app/interfaces/apoderadoInterface';
import { ModalVerFichaEstudianteComponent } from '../modal-ver-ficha-estudiante/modal-ver-ficha-estudiante.component';

@Component({
  selector: 'app-ficha-alumnos',
  templateUrl: './ficha-alumnos.component.html',
  styleUrls: ['./ficha-alumnos.component.css']
})
export class FichaAlumnosComponent implements OnInit {
totalEstudiantes: number = 0; 
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

  constructor(public dialog: MatDialog, private estudianteService: EstudianteService) { }

  ngOnInit(): void {
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

  openModalVerFichaEstudiante(element: any) {
    console.log(element);
    console.log(element);
    console.log(element);
    console.log(element);
    
    const dialogRef = this.dialog.open(ModalVerFichaEstudianteComponent, { width: '70%', data: element });
    dialogRef.afterClosed().subscribe(() => {
      this.loadEstudiantes();
    });
  }

  getCursoKeys(): string[] {
    return Object.keys(this.dataSourceCursos);
  }

}

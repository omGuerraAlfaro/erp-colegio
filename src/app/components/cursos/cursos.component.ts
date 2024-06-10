import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CursoDetalle, CursoEstudianteDetalle, ICursoEstudiante } from 'src/app/interfaces/cursoInterface';
import { CursosService } from 'src/app/services/cursoService/cursos.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit, AfterViewInit {

  @ViewChild('paginator1') paginator1!: MatPaginator;
  @ViewChild('paginator2') paginator2!: MatPaginator;
  displayedColumns: string[] = ['id', 'nombre', 'nombre_profesor', 'telefono_profesor', 'correo_profesor', 'rut_profesor2'];
  displayedColumnsCursos: string[] = ['id', 'nombre_estudiante', 'rut_estudiante2', 'telefono_estudiante', 'genero_estudiante'];
  dataSource = new MatTableDataSource<CursoDetalle>();
  dataSourceCursos: { [key: string]: { dataSource: MatTableDataSource<CursoEstudianteDetalle>, nombreCurso: string } } = {};

  constructor(private cursosServices: CursosService) { }

  ngOnInit(): void {
    this.loadCursos();
    this.loadCursosConEstudiantes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator1;
  }

  loadCursos(): void {
    this.cursosServices.getInfoCurso().subscribe({
      next: (cursos: CursoDetalle[]) => {
        console.log('cursos:', cursos);
        const modifiedData = cursos.map(curso => ({
          ...curso,
          nombre_profesor: curso.profesorConnection.primer_nombre + ' ' + curso.profesorConnection.primer_apellido,
          telefono_profesor: curso.profesorConnection.telefono,
          correo_profesor: curso.profesorConnection.correo_electronico,
          rut_profesor2: curso.profesorConnection.rut + '-' + curso.profesorConnection.dv,
        }));
        this.dataSource.data = modifiedData;
      },
      error: (error) => {
        console.error('Error fetching cursos:', error);
      }
    });
  }

  loadCursosConEstudiantes(): void {
    this.cursosServices.getInfoCursoConEstudiantes().subscribe({
      next: (cursos: any) => {
        console.log('cursos:', cursos);
        if (cursos) {
          cursos.forEach((curso: any) => {
            const cursoId = curso.id.toString();
            const nombreCurso = curso.nombre;
            const estudiantesArray = curso.estudiantes.map((estudiante: any) => ({
              id: estudiante.id,
              nombre_estudiante: `${estudiante.primer_nombre} ${estudiante.segundo_nombre} ${estudiante.primer_apellido} ${estudiante.segundo_apellido}`,
              rut_estudiante2: `${estudiante.rut}-${estudiante.dv}`,
              telefono_estudiante: estudiante.telefono_contacto,
              genero_estudiante: estudiante.genero
            }));
            console.log('estudiantes:', estudiantesArray);
            if (estudiantesArray.length) {
              const dataSource = new MatTableDataSource<CursoEstudianteDetalle>(estudiantesArray);
              this.dataSourceCursos[cursoId] = { dataSource, nombreCurso };
            }
          });
        }
      },
      error: (error) => {
        console.error('Error fetching cursos con estudiantes:', error);
      }
    });
  }

  getCursoKeys(): string[] {
    return Object.keys(this.dataSourceCursos);
  }

}

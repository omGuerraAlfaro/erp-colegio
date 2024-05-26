import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CursoDetalle, CursoEstudianteDetalle, ICursoEstudiante } from 'src/app/interfaces/cursoInterface';
import { CursosService } from 'src/app/services/cursoService/cursos.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  displayedColumns: string[] = ['id', 'nombre', 'nombre_profesor', 'telefono_profesor', 'correo_profesor', 'rut_profesor2'];
  displayedColumnsCursos: string[] = ['id', 'nombre', 'rut_estudiante2', 'nombre_estudiante', 'telefono_estudiante', 'genero_estudiante'];
  dataSource = new MatTableDataSource<CursoDetalle>();
  dataSourceCursos: { [key: string]: MatTableDataSource<CursoEstudianteDetalle> } = {};

  constructor(private cursosServices: CursosService) { }

  ngOnInit(): void {
    this.loadCursos();
    this.loadCursosConEstudiantes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSourceCursos.paginator = this.paginator2;
  }

  loadCursos(): void {
    this.cursosServices.getInfoCurso().subscribe({
      next: (cursos: CursoDetalle[]) => {
        console.log('cursos:', cursos);
        const modifiedData = cursos.map(curso => {
          return {
            ...curso,
            nombre_profesor: curso.profesorConnection.primer_nombre + ' ' + curso.profesorConnection.primer_apellido,
            telefono_profesor: curso.profesorConnection.telefono,
            correo_profesor: curso.profesorConnection.correo_electronico,
            rut_profesor2: curso.profesorConnection.rut + '-' + curso.profesorConnection.dv,
          };
        });

        this.dataSource.data = modifiedData;
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });
  }

  loadCursosConEstudiantes(): void {
    this.cursosServices.getInfoCursoConEstudiantes().subscribe({
      next: (cursoEstudiante: ICursoEstudiante) => {
        console.log('cursoEstudiante:', cursoEstudiante);
        if (cursoEstudiante && cursoEstudiante.cursos) {
          for (const [cursoId, estudiantes] of Object.entries(cursoEstudiante.cursos)) {
            console.log('estudiantes:', estudiantes);
            if (estudiantes) {
              const dataSource = new MatTableDataSource<CursoEstudianteDetalle>(estudiantes);
              this.dataSourceCursos[cursoId] = dataSource;
            }
          }
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

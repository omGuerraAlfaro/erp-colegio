import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CursoDetalle, CursoEstudianteDetalle } from 'src/app/interfaces/cursoInterface';
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
  displayedColumns2: string[] = ['id', 'nombre', 'nombre_estudiante', 'telefono_estudiante', 'rut_estudiante2', 'genero_estudiante'];
  dataSource = new MatTableDataSource<CursoDetalle>();
  dataSource2 = new MatTableDataSource<CursoEstudianteDetalle>();

  constructor(private cursosServices: CursosService) { }

  ngOnInit(): void {
    this.loadCursos();
    this.loadCursosConEstudiantes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator2;
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
      next: (cursos: CursoEstudianteDetalle[]) => {
        console.log('cursos:', cursos);
        const modifiedData2 = cursos.map(curso => {
          return {
              ...curso,
              nombre_estudiante: curso.estudiantes.primer_nombre + ' ' + curso.estudiantes.primer_apellido,
              telefono_estudiante: curso.estudiantes.telefono_contacto,
              rut_estudiante2: curso.estudiantes.rut + '-' + curso.estudiantes.dv,
              genero_estudiante: curso.estudiantes.genero,
          };
      });

        this.dataSource2.data = modifiedData2;
      },
      error: (error) => {
        console.error('Error fetching boletas:', error);
      }
    });
  }
}

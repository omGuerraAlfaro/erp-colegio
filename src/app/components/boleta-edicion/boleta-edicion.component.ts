import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDetalleBoletaComponent } from '../modal-detalle-boleta/modal-detalle-boleta.component';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import { CursoEstudianteDetalle } from 'src/app/interfaces/cursoInterface';
import { ModalBoletasEstudianteComponent } from '../modal-boletas-estudiante/modal-boletas-estudiante.component';

@Component({
  selector: 'app-boleta-edicion',
  templateUrl: './boleta-edicion.component.html',
  styleUrls: ['./boleta-edicion.component.css']
})
export class BoletaEdicionComponent implements OnInit {

  displayedColumnsCursos: string[] = [
    'numero',
    'id',
    'nombre_estudiante',
    'rut_estudiante',
    'genero_estudiante',
    'acciones'
  ];

  dataSourceCursos: {
    [cursoId: string]: {
      nombreCurso: string;
      dataSource2: MatTableDataSource<CursoEstudianteDetalle>;
    }
  } = {};

  constructor(
    private cursosService: CursosService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadCursosConEstudiantes();
  }

  loadCursosConEstudiantes(): void {
    this.cursosService.getInfoCursoConEstudiantes().subscribe({
      next: (cursos: any[]) => {
        cursos.forEach(curso => {
          const key = curso.id.toString();
          const sorted = curso.estudiantes.sort((a: any, b: any) =>
            a.primer_apellido_alumno.localeCompare(b.primer_apellido_alumno)
          );
          const data = sorted.map((e: any) => ({
            id: e.id,
            nombre_estudiante: `${e.primer_nombre_alumno} ${e.segundo_nombre_alumno} ` +
                                `${e.primer_apellido_alumno} ${e.segundo_apellido_alumno}`,
            rut_estudiante: `${e.rut}-${e.dv}`,
            genero_estudiante: e.genero_alumno
          }));
          if (data.length) {
            this.dataSourceCursos[key] = {
              nombreCurso: curso.nombre,
              dataSource2: new MatTableDataSource<CursoEstudianteDetalle>(data)
            };
          }
        });
      },
      error: err => console.error('Error al cargar cursos con estudiantes', err)
    });
  }

  getCursoKeys(): string[] {
    return Object.keys(this.dataSourceCursos);
  }

  openModalDetalleBoleta(estudiante: CursoEstudianteDetalle): void {
    this.dialog.open(ModalBoletasEstudianteComponent, {
      width: '60%',
      data: estudiante
    });
  }
}

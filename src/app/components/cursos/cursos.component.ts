import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import { CursoEstudianteDetalle } from 'src/app/interfaces/cursoInterface';
import { MatDialog } from '@angular/material/dialog';
import { ModalIngresoAnotacionComponent } from '../modal-ingreso-anotacion/modal-ingreso-anotacion.component';
import { ModalVerAnotacionComponent } from '../modal-ver-anotacion/modal-ver-anotacion.component';


@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit, AfterViewInit {
  displayedColumnsCursos: string[] = ['id', 'nombre_estudiante', 'rut_estudiante2', 'ver_anotacion', 'ingresar_anotacion'];
  dataSourceCursos: { [key: string]: { dataSource: MatTableDataSource<CursoEstudianteDetalle>, nombreCurso: string } } = {};
  hasLoadedData = false;

  constructor(
    private cursosServices: CursosService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadCursosConEstudiantes();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
      this.initializeTabs();
    }, 100);
  }

  loadCursosConEstudiantes(): void {
    this.cursosServices.getInfoCursoConEstudiantes().subscribe({
      next: (cursos: any) => {
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
            if (estudiantesArray.length) {
              const dataSource = new MatTableDataSource<CursoEstudianteDetalle>(estudiantesArray);
              this.dataSourceCursos[cursoId] = { dataSource, nombreCurso };
            }
          });
          this.hasLoadedData = true;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error fetching cursos con estudiantes:', error);
      }
    });
  }

  initializeTabs(): void {
    const tabElements = document.querySelectorAll('.nav-tabs .nav-link');
    tabElements.forEach(tab => {
      const tabEl = tab as HTMLElement;
      const targetId = tabEl.getAttribute('data-bs-target');
      if (targetId) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          targetEl.classList.remove('show', 'active');
        }
      }
    });

    if (tabElements.length) {
      const firstTab = tabElements[0] as HTMLElement;
      firstTab.classList.add('active');
      const firstTabTargetId = firstTab.getAttribute('data-bs-target');
      if (firstTabTargetId) {
        const firstTabContent = document.querySelector(firstTabTargetId);
        if (firstTabContent) {
          firstTabContent.classList.add('show', 'active');
        }
      }
    }
  }

  getCursoKeys(): string[] {
    return Object.keys(this.dataSourceCursos);
  }

  openModalIngresoAnotacion(element: any): void {
    const dialogRef = this.dialog.open(ModalIngresoAnotacionComponent, {
      width: '60%',
      height: 'auto',
      data: element
    });

    // dialogRef.componentInstance.boletaEditada.subscribe(() => {
    //   this.loadBoletas();
    // });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });

  }

  openModalVerAnotacion(element: any): void {
    const dialogRef = this.dialog.open(ModalVerAnotacionComponent, {
      width: '80%',
      height: 'auto',
      data: element
    });

    // dialogRef.componentInstance.boletaEditada.subscribe(() => {
    //   this.loadBoletas();
    // });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });

  }
}

// @ViewChild('paginator1') paginator1!: MatPaginator;
// @ViewChild('paginator2') paginator2!: MatPaginator;
// displayedColumns: string[] = ['id', 'nombre', 'nombre_profesor', 'telefono_profesor', 'correo_profesor', 'rut_profesor2'];
// dataSource = new MatTableDataSource<CursoDetalle>();

// ngAfterViewInit() {
//   this.dataSource.paginator = this.paginator1;
// }

// loadCursos(): void {
//   this.cursosServices.getInfoCurso().subscribe({
//     next: (cursos: CursoDetalle[]) => {
//       console.log('cursos:', cursos);
//       const modifiedData = cursos.map(curso => ({
//         ...curso,
//         nombre_profesor: curso.profesorConnection.primer_nombre + ' ' + curso.profesorConnection.primer_apellido,
//         telefono_profesor: curso.profesorConnection.telefono,
//         correo_profesor: curso.profesorConnection.correo_electronico,
//         rut_profesor2: curso.profesorConnection.rut + '-' + curso.profesorConnection.dv,
//       }));
//       this.dataSource.data = modifiedData;
//     },
//     error: (error) => {
//       console.error('Error fetching cursos:', error);
//     }
//   });
// }
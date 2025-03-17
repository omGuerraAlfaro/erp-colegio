import { Component, OnInit, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import { CursoEstudianteDetalle } from 'src/app/interfaces/cursoInterface';
import { MatDialog } from '@angular/material/dialog';
import { ModalIngresoAnotacionComponent } from '../modal-ingreso-anotacion/modal-ingreso-anotacion.component';
import { ModalVerAnotacionComponent } from '../modal-ver-anotacion/modal-ver-anotacion.component';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos-anotaciones.component.html',
  styleUrls: ['./cursos-anotaciones.component.css']
})
export class CursosAnotacionesComponent implements OnInit, AfterViewInit, AfterViewChecked {
  displayedColumnsCursos: string[] = ['id', 'nombre_estudiante', 'rut_estudiante2', 'ver_anotacion', 'ingresar_anotacion'];
  dataSourceCursos: { [key: string]: { dataSource: MatTableDataSource<CursoEstudianteDetalle>, nombreCurso: string } } = {};
  hasLoadedData = false;
  activeTabId: string | null = null;  // Store the active tab ID

  constructor(
    private cursosServices: CursosService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCursosConEstudiantes();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeTabs();
      this.restoreActiveTab();  // Restore active tab after initializing
    }, 1000);
  }

  ngAfterViewChecked(): void {
    if (this.hasLoadedData) {
      this.restoreActiveTab(); // Restore active tab
    }
  }

  loadCursosConEstudiantes(): void {
    this.cursosServices.getInfoCursoConEstudiantes().subscribe({
      next: (cursos: any) => {
        if (cursos) {
          
          cursos.forEach((curso: any) => {

            curso.estudiantes.sort((a: any, b: any) =>
              a.primer_apellido_alumno.localeCompare(b.primer_apellido_alumno)
            );

            const cursoId = curso.id.toString();
            const estudiantesArray = curso.estudiantes.map((estudiante: any) => ({
              id: estudiante.id,
              nombre_estudiante: `${estudiante.primer_nombre_alumno} ${estudiante.segundo_nombre_alumno} ${estudiante.primer_apellido_alumno} ${estudiante.segundo_apellido_alumno}`,
              rut_estudiante2: `${estudiante.rut}-${estudiante.dv}`,
              telefono_estudiante: estudiante.telefono_contacto,
              genero_estudiante: estudiante.genero
            }));
            if (estudiantesArray.length) {
              this.dataSourceCursos[cursoId] = { 
                dataSource: new MatTableDataSource<CursoEstudianteDetalle>(estudiantesArray), 
                nombreCurso: curso.nombre 
              };
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
    tabElements.forEach((tab) => {
      const targetId = (tab as HTMLElement).getAttribute('data-bs-target');
      if (targetId) {
        const targetEl = document.querySelector(targetId);
        targetEl?.classList.remove('show', 'active');
      }
      (tab as HTMLElement).classList.remove('active');
    });
  }

  restoreActiveTab(): void {
    const tabElements = document.querySelectorAll('.nav-tabs .nav-link');
    let activeTab: HTMLElement | null = this.activeTabId 
      ? document.querySelector(`[data-bs-target="${this.activeTabId}"]`) as HTMLElement
      : null;

    // Fallback to the first tab if no active tab found
    if (!activeTab) {
      activeTab = tabElements[0] as HTMLElement; // Default to first tab
    }

    if (activeTab) {
      activeTab.classList.add('active');
      const targetId = activeTab.getAttribute('data-bs-target');
      const tabContent = targetId ? document.querySelector(targetId) : null;
      tabContent?.classList.add('show', 'active');
    }
  }

  setActiveTab(tabId: string): void {
    this.activeTabId = tabId;
  }

  openModalIngresoAnotacion(element: any): void {
    this.setActiveTab(this.getActiveTabId());  // Save active tab before opening modal
    const dialogRef = this.dialog.open(ModalIngresoAnotacionComponent, {
      width: '60%',
      height: 'auto',
      data: element
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('El modal se cerró');
    });
  }

  openModalVerAnotacion(element: any): void {
    this.setActiveTab(this.getActiveTabId());
    const dialogRef = this.dialog.open(ModalVerAnotacionComponent, {
      position: { top: '50px' },
      width: '80%',
      height: 'auto',
      data: element
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('El modal se cerró');
    });
  }

  getCursoKeys(): string[] {
    return Object.keys(this.dataSourceCursos);
  }

  getActiveTabId(): string {
    const activeTab = document.querySelector('.nav-tabs .nav-link.active') as HTMLElement;
    return activeTab?.getAttribute('data-bs-target') || '';
  }
}

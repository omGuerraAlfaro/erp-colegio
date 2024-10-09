import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IInscripcionMatricula } from 'src/app/interfaces/inscripcionInterface';
import { InscripcionMatriculaService } from 'src/app/services/InscripcionMatriculaService/InscripcionMatriculaService';
import { ModalTerminarFormularioMatriculaComponent } from '../modal-terminar-formulario-matricula/modal-terminar-formulario-matricula.component';

@Component({
  selector: 'app-inscripcion-matricula',
  templateUrl: './inscripcion-matricula.component.html',
  styleUrls: ['./inscripcion-matricula.component.css']
})
export class InscripcionMatriculaComponent implements OnInit {

  inscripciones?: IInscripcionMatricula[] = [];
  searchTerms = {
    text: ''
  };
  constructor(
    private inscripcionService: InscripcionMatriculaService,
    public dialog: MatDialog
  ) { }

  displayedColumns: string[] = ['id_inscripcion', 'nombre_alumno', 'rut_alumno', 'curso_alumno', 'nombre_apoderado', 'rut_apoderado', 'telefono_apoderado', 'correo_apoderado', 'parentesco_apoderado', 'fecha_matricula_inscripcion', 'acciones'];
  dataSource = new MatTableDataSource<IInscripcionMatricula>();

  ngOnInit(): void {
    this.loadInscripciones();
    this.dataSource.filterPredicate = (data: IInscripcionMatricula, filter: string) => {
      return data.id_inscripcion.trim().toLowerCase().includes(filter);
    };
  }


  loadInscripciones() {
    this.inscripcionService.getInscripciones().subscribe({
      next: (data: IInscripcionMatricula[]) => {
        console.log('Inscripciones fetched successfully:', data);
        this.dataSource.data = data.reverse();
        //this.inscripciones = data;

      },
      error: (error) => {
        console.error('Error fetching inscripciones:', error);
      }
    });
  }

  terminarFormulario(element: any) {
    console.log(element);

    const dialogRef = this.dialog.open(ModalTerminarFormularioMatriculaComponent, {
      width: '70%',
      height: 'auto',
      data: element
    });

    dialogRef.componentInstance.inscripcionOK.subscribe(() => {
      this.loadInscripciones();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El modal se cerró');
    });


  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getCursoAlumnoLabel(curso: number): string {
    const cursoLabels: { [key: string]: string } = {
      '1': 'Pre-kinder',
      '2': 'Kinder',
      '3': 'Primero Básico',
      '4': 'Segundo Básico',
      '5': 'Tercero Básico',
      '6': 'Cuarto Básico',
      '7': 'Quinto Básico',
      '8': 'Sexto Básico',
      '9': 'Séptimo Básico',
      '10': 'Octavo Básico'
    };
    
    return cursoLabels[curso.toString()] || 'N/A';
  }


}

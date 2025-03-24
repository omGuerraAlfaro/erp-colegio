import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IInscripcionMatricula } from 'src/app/interfaces/inscripcionInterface';
import { InscripcionTallerService } from 'src/app/services/InscripcionTallerService/InscripcionTallerService';
import { ModalTerminarFormularioMatriculaComponent } from '../modal-terminar-formulario-matricula/modal-terminar-formulario-matricula.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inscripcion-talleres',
  templateUrl: './inscripcion-talleres.component.html',
  styleUrls: ['./inscripcion-talleres.component.css']
})
export class InscripcionTalleresComponent implements OnInit {
  groupedData: { [tallerKey: string]: any[] } = {};
  displayedColumns: string[] = [
    'id_inscripcion',
    'nombre_alumno',
    'rut_alumno',
    'fecha_matricula_inscripcion',
    'acciones'
  ];
  
  // Propiedad para controlar si los datos están listos y contador global
  dataOk: boolean = false;
  totalInscripciones: number = 0;

  constructor(
    private inscripcionService: InscripcionTallerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadInscripciones();
  }

  loadInscripciones(): void {
    this.inscripcionService.getInscripcionesTaller().subscribe({
      next: (data: any[]) => {
        const grouped: { [tallerKey: string]: any[] } = {};
        // Contador global de inscripciones
        this.totalInscripciones = data.length;

        data.forEach(inscripcion => {
          let tallerKey = 'Sin taller';
          if (inscripcion.tipo_taller && inscripcion.tipo_taller.id_taller) {
            const idTaller = inscripcion.tipo_taller.id_taller;
            // Si la descripción está vacía, usamos 'Sin nombre'
            const descTaller = inscripcion.tipo_taller.descripcion_taller && inscripcion.tipo_taller.descripcion_taller.trim() !== ''
              ? inscripcion.tipo_taller.descripcion_taller
              : 'Sin nombre';
            tallerKey = `${idTaller} - ${descTaller}`;
          }
          if (!grouped[tallerKey]) {
            grouped[tallerKey] = [];
          }
          grouped[tallerKey].push(inscripcion);
        });
        this.groupedData = grouped;
        this.dataOk = true;
      },
      error: (error) => {
        console.error('Error fetching inscripciones:', error);
        this.dataOk = false;
      }
    });
  }

  opciones(idInscripcion: number): void {
    Swal.fire({
      title: 'Opciones',
      text: 'Elija una opción',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cerrar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción eliminará la inscripción.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'No, cancelar'
        }).then((confirmResult) => {
          if (confirmResult.isConfirmed) {
            this.inscripcionService.deleteInscripcionTaller(idInscripcion).subscribe({
              next: () => {
                Swal.fire('Eliminado', 'La inscripción ha sido eliminada.', 'success');
                this.loadInscripciones();
              },
              error: (err) => {
                Swal.fire('Error', 'Hubo un error al eliminar la inscripción.', 'error');
              }
            });
          }
        });
      }
    });
  }

  exportToExcel(): void {
    const wb = XLSX.utils.book_new();
  
    Object.keys(this.groupedData).forEach(taller => {
      const inscripciones = this.groupedData[taller];
      const worksheetData = inscripciones.map(i => ({
        'ID Inscripción': i.id_inscripcion,
        'Nombre Alumno': `${i.estudiante.primer_nombre_alumno} ${i.estudiante.segundo_nombre_alumno} ${i.estudiante.primer_apellido_alumno} ${i.estudiante.segundo_apellido_alumno}`,
        'RUT Alumno': `${i.estudiante.rut}-${i.estudiante.dv}`,
        'Fecha Inscripción': new Date(i.fecha_matricula_inscripcion).toLocaleDateString()
      }));
  
      const ws = XLSX.utils.json_to_sheet(worksheetData);
      // El nombre de la hoja no debe exceder 31 caracteres
      XLSX.utils.book_append_sheet(wb, ws, taller.substring(0, 31));
    });
  
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blobData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blobData, 'InscripcionesTalleres2025.xlsx');
  }
}

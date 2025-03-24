import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IInscripcionMatricula } from 'src/app/interfaces/inscripcionInterface';
import { InscripcionTallerService } from 'src/app/services/InscripcionTallerService/InscripcionTallerService';
import { ModalTerminarFormularioMatriculaComponent } from '../modal-terminar-formulario-matricula/modal-terminar-formulario-matricula.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import Swal from 'sweetalert2';
import { KeyValue } from '@angular/common';

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
    'curso',
    'fecha_matricula_inscripcion',
    'acciones'
  ];

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
        this.totalInscripciones = data.length;

        data.forEach(inscripcion => {
          let tallerKey = '0 - Sin taller';
          if (inscripcion.tipo_taller && inscripcion.tipo_taller.id_taller) {
            const idTaller = inscripcion.tipo_taller.id_taller;
            const descTaller = inscripcion.tipo_taller.descripcion_taller?.trim() || 'Sin nombre';
            tallerKey = `${idTaller} - ${descTaller}`;
          }
          if (!grouped[tallerKey]) {
            grouped[tallerKey] = [];
          }
          grouped[tallerKey].push(inscripcion);
        });

        // Ordenar y reconstruir como objeto
        const sortedEntries = Object.entries(grouped).sort((a, b) => {
          const idA = parseInt(a[0].split(' - ')[0], 10);
          const idB = parseInt(b[0].split(' - ')[0], 10);

          if (idA === 0) return 1;
          if (idB === 0) return -1;

          return idA - idB;
        });

        this.groupedData = sortedEntries.reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as { [tallerKey: string]: any[] });

        this.dataOk = true;
      },
      error: (error) => {
        console.error('Error fetching inscripciones:', error);
        this.dataOk = false;
      }
    });
  }

  customSort = (a: KeyValue<string, any[]>, b: KeyValue<string, any[]>): number => {
    const idA = parseInt(a.key.split(' - ')[0], 10);
    const idB = parseInt(b.key.split(' - ')[0], 10);

    if (idA === 0) return 1;
    if (idB === 0) return -1;

    return idA - idB;
  };

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
              error: () => {
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

    Object.entries(this.groupedData).forEach(([tallerKey, inscripciones]) => {
      const worksheetData = inscripciones.map(i => ({
        'ID Inscripción': i.id_inscripcion,
        'Nombre Alumno': `${i.estudiante.primer_nombre_alumno} ${i.estudiante.segundo_nombre_alumno} ${i.estudiante.primer_apellido_alumno} ${i.estudiante.segundo_apellido_alumno}`,
        'RUT Alumno': `${i.estudiante.rut}-${i.estudiante.dv}`,
        'Curso': i.curso?.nombre || 'Sin curso',
        'Fecha Inscripción': new Date(i.fecha_matricula_inscripcion).toLocaleDateString()
      }));

      const ws = XLSX.utils.json_to_sheet(worksheetData);
      XLSX.utils.book_append_sheet(wb, ws, tallerKey.substring(0, 31));
    });

    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blobData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blobData, 'InscripcionesTalleres2025.xlsx');
  }
}

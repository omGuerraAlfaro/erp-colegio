import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-ver-anotacion',
  templateUrl: './modal-ver-anotacion.component.html',
  styleUrls: ['./modal-ver-anotacion.component.css']
})
export class ModalVerAnotacionComponent implements OnInit {
  annotations: any[] = [];
  estudiante: { nombre: string, rut: string, telefono: string, genero: string } | null = null;
  displayedColumns: string[] = ['titulo', 'descripcion', 'fecha', 'tipo', 'asignatura', 'acciones'];

  constructor(
    private estudianteService: EstudianteService,
    private dialogRef: MatDialogRef<ModalVerAnotacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data);
    this.estudiante = {
      nombre: this.data.nombre_estudiante,
      rut: this.data.rut_estudiante2,
      telefono: this.data.telefono_estudiante,
      genero: this.data.genero_estudiante
    };
  }

  ngOnInit(): void {
    this.fetchAnnotations();
  }

  fetchAnnotations(): void {
    this.estudianteService.getAnotaciones(this.data.id).subscribe({
      next: (data: any) => {
        this.annotations = data;
      },
      error: (error) => {
        console.error('Error fetching annotations', error);
      }
    });
  }

  openEditAnnotation(annotation: any): void {
    Swal.fire({
      title: 'Editar Anotación',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Título" value="${annotation.anotacion_titulo}">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Descripción">${annotation.anotacion_descripcion}</textarea>
        <input id="swal-input3" class="swal2-input" placeholder="Fecha de Ingreso" value="${new Date(annotation.fecha_ingreso).toISOString().substring(0, 10)}" type="date">
        <select id="swal-input4" class="swal2-select">
          <option value="positiva" ${annotation.es_positiva ? 'selected' : ''}>Positiva</option>
          <option value="negativa" ${annotation.es_negativa ? 'selected' : ''}>Negativa</option>
          <option value="neutra" ${!annotation.es_positiva && !annotation.es_negativa ? 'selected' : ''}>Neutra</option>
        </select>
      `,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: 'Eliminar',
      cancelButtonText: 'Cerrar',
      preConfirm: () => {
        // Obtiene el valor del select y calcula es_neutra
        const type = (document.getElementById('swal-input4') as HTMLSelectElement).value;
        const esPositiva = type === 'positiva';
        const esNegativa = type === 'negativa';
        const esNeutra = !esPositiva && !esNegativa;
        const updatedAnnotation = {
          anotacion_titulo: (document.getElementById('swal-input1') as HTMLInputElement).value,
          anotacion_descripcion: (document.getElementById('swal-input2') as HTMLTextAreaElement).value,
          fecha_ingreso: (document.getElementById('swal-input3') as HTMLInputElement).value,
          es_positiva: esPositiva,
          es_negativa: esNegativa,
          es_neutra: esNeutra
        };
        return updatedAnnotation;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // Llama al servicio updateAnotacion
        const updatedData = result.value;
        this.estudianteService.updateAnotacion(
          annotation.id,
          updatedData,
        ).subscribe({
          next: (response) => {
            Swal.fire('Actualizado', 'La anotación ha sido actualizada.', 'success');
            this.fetchAnnotations();
          },
          error: (error) => {
            Swal.fire('Error', 'No se pudo actualizar la anotación.', 'error');
          }
        });
      } else if (result.isDenied) {
        // Confirmación para eliminar
        Swal.fire({
          title: '¿Estás seguro?',
          text: "Esta acción eliminará la anotación.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        }).then((confirmResult) => {
          if (confirmResult.isConfirmed) {
            this.estudianteService.deleteAnotacion(this.data.id, annotation.id).subscribe({
              next: () => {
                Swal.fire('Eliminado', 'La anotación ha sido eliminada.', 'success');
                this.fetchAnnotations();
              },
              error: () => {
                Swal.fire('Error', 'No se pudo eliminar la anotación.', 'error');
              }
            });
          }
        });
      }
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}

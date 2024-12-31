import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstudianteService } from 'src/app/services/estudianteService/estudiante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-edit-estudiante',
  templateUrl: './modal-edit-estudiante.component.html',
  styleUrls: ['./modal-edit-estudiante.component.css']
})
export class ModalEditEstudianteComponent implements OnInit {
  @Output() editOk = new EventEmitter<void>();
  editForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalEditEstudianteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private estudianteService: EstudianteService,
    private fb: FormBuilder
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      primer_nombre_alumno: [this.data.primer_nombre_alumno.trim(), [Validators.required]],
      segundo_nombre_alumno: [this.data.segundo_nombre_alumno.trim()],
      primer_apellido_alumno: [this.data.primer_apellido_alumno.trim(), [Validators.required]],
      segundo_apellido_alumno: [this.data.segundo_apellido_alumno.trim()],
      fecha_nacimiento_alumno: [this.data.fecha_nacimiento_alumno, [Validators.required]],
      fecha_matricula: [this.data.fecha_matricula, [Validators.required]],
      rut: [this.data.rut, [Validators.required]],
      genero_alumno: [this.data.genero_alumno, [Validators.required]],
      autorizacion_fotografias: [this.data.autorizacion_fotografias],
      apto_educacion_fisica: [this.data.apto_educacion_fisica],
      es_pae: [this.data.es_pae],
      estado_estudiante: [this.data.estado_estudiante]
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      const estudianteActualizado = { ...this.editForm.value };

      // Dividir el RUT en base y DV
      const [rut, dv] = estudianteActualizado.rut.split('-');
      estudianteActualizado.rut = rut.trim();
      estudianteActualizado.dv = dv.trim();

      estudianteActualizado.fecha_nacimiento_alumno = this.convertToUTC(estudianteActualizado.fecha_nacimiento_alumno);
      estudianteActualizado.fecha_matricula = this.convertToUTC(estudianteActualizado.fecha_matricula);

      estudianteActualizado.genero_alumno = estudianteActualizado.genero_alumno.toUpperCase().charAt(0);

      this.estudianteService.updateEstudiante(this.data.id, estudianteActualizado).subscribe({
        next: () => {
          Swal.fire('Éxito', 'La información del estudiante se ha actualizado.', 'success');
          this.editOk.emit(); // Emitir evento de éxito para el componente padre
          this.closeModal();  // Cerrar el modal
        },
        error: (error) => {
          Swal.fire('Error', 'Ocurrió un problema al actualizar la información.', 'error');
          console.error('Error al actualizar el estudiante:', error);
        }
      });
    } else {
      Swal.fire('Advertencia', 'Por favor, completa todos los campos requeridos.', 'warning');
    }
  }

  convertToUTC(date: string): string {
    const localDate = new Date(date);
  
    return new Date(Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate()
    )).toISOString().split('T')[0];
  }
  
}

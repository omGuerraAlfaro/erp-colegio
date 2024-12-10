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
  ) {}

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
      apto_educacion_fisica: [this.data.apto_educacion_fisica]
    });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      console.log("EDITTTTTTTTTTTTTTTTTTTTTTT");
      
      // this.estudianteService.updateEstudiante(this.data.id, this.editForm.value).subscribe({
      //   next: () => {
      //     Swal.fire('Éxito', 'La información del estudiante se ha actualizado.', 'success');
      //     this.editOk.emit();
      //     this.closeModal();
      //   },
      //   error: () => {
      //     Swal.fire('Error', 'Ocurrió un problema al actualizar la información.', 'error');
      //   }
      // });
    }
  }
}

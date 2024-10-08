import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IInscripcionMatricula } from 'src/app/interfaces/inscripcionInterface';
import { InscripcionMatriculaService } from 'src/app/services/InscripcionMatriculaService/InscripcionMatriculaService';

@Component({
  selector: 'app-modal-terminar-formulario-matricula',
  templateUrl: './modal-terminar-formulario-matricula.component.html',
  styleUrls: ['./modal-terminar-formulario-matricula.component.css']
})
export class ModalTerminarFormularioMatriculaComponent implements OnInit {
  @Output() inscripcionOK = new EventEmitter<void>();
  inscripcionForm: FormGroup;
  inscripcionData: IInscripcionMatricula | null = null;

  constructor(
    private fb: FormBuilder,
    private inscripcionService: InscripcionMatriculaService,
    public dialogRef: MatDialogRef<ModalTerminarFormularioMatriculaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data);
    this.inscripcionForm = this.fb.group({
      id_inscripcion: [''],
      primer_nombre_alumno: [''],
      segundo_nombre_alumno: [''],
      primer_apellido_alumno: [''],
      segundo_apellido_alumno: [''],
      rut_alumno: [''],
      genero_alumno: [''],
      fecha_nacimiento_alumno: [''],
      curso_alumno: [''],
      primer_nombre_apoderado: [''],
      segundo_nombre_apoderado: [''],
      primer_apellido_apoderado: [''],
      segundo_apellido_apoderado: [''],
      rut_apoderado: [''],
      telefono_apoderado: [''],
      correo_apoderado: [''],
      parentesco_apoderado: [''],
      estado_civil: [''],
      profesion_oficio: [''],
      direccion: [''],
      comuna: [''],
      fecha_matricula_inscripcion: ['']
    });
  }

  ngOnInit(): void {
    this.loadInscripciones();

  }

  loadInscripciones() {
    this.inscripcionService.getInscripcion(this.data).subscribe({
      next: (data: IInscripcionMatricula) => {
        console.log('Inscripciones fetched successfully:', data);
        this.inscripcionData = data;
        this.inscripcionForm.patchValue(data);
        //this.inscripciones = data;

      },
      error: (error) => {
        console.error('Error fetching inscripciones:', error);
      }
    });
  }

  onSubmit() {
    if (this.inscripcionForm.valid) {
      console.log("VALIDO");

      // Handle form submission
      // this.inscripcionService.updateInscripcion(this.inscripcionForm.value).subscribe({
      //   next: () => {
      //     this.inscripcionOK.emit();  // Emit event on successful update
      //     this.closeModal();
      //   },
      //   error: (error) => {
      //     console.error('Error updating inscripción:', error);
      //   }
      // });
    }
  }
  closeModal(): void {
    this.dialogRef.close();
  }
}

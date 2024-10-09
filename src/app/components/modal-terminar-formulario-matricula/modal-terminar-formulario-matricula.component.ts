import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IInscripcionMatricula } from 'src/app/interfaces/inscripcionInterface';
import { InscripcionMatriculaService } from 'src/app/services/InscripcionMatriculaService/InscripcionMatriculaService';
import { rutValidator } from './validator';

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
      id_inscripcion: [{ value: '', disabled: true }],
      fecha_matricula_inscripcion: [{ value: '', disabled: true }],
      primer_nombre_alumno: ['', [Validators.required, Validators.minLength(3)]],
      segundo_nombre_alumno: [''],
      primer_apellido_alumno: ['', [Validators.required, Validators.minLength(3)]],
      segundo_apellido_alumno: ['', [Validators.required, Validators.minLength(3)]],
      rut_alumno: ['', [Validators.required, rutValidator()]],
      genero_alumno: ['', [Validators.required]],
      fecha_nacimiento_alumno: ['', [Validators.required]],
      curso_alumno: ['', [Validators.required]],
      enfermedad_cronica_alumno: [''],
      alergia_alimento_alumno: [''],
      alergia_medicamento_alumno: [''],
      prevision_alumno: ['', [Validators.required]],
      consultorio_clinica_alumno: ['', [Validators.required]],
      es_pae: [false],
      eximir_religion: [false],
      autorizacion_fotografias: [false],
      apto_educacion_fisica: [false],
      observaciones_alumno: [''],
      primer_nombre_apoderado: ['', [Validators.required, Validators.minLength(3)]],
      segundo_nombre_apoderado: [''],
      primer_apellido_apoderado: ['', [Validators.required, Validators.minLength(3)]],
      segundo_apellido_apoderado: ['', [Validators.required, Validators.minLength(3)]],
      rut_apoderado: ['', [Validators.required, rutValidator()]],
      telefono_apoderado: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      correo_apoderado: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      parentesco_apoderado: ['', [Validators.required]],
      estado_civil: ['', [Validators.required]],
      profesion_oficio: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      comuna: ['', [Validators.required]],
      primer_nombre_apoderado_suplente: ['', [Validators.required, Validators.minLength(3)]],
      segundo_nombre_apoderado_suplente: [''],
      primer_apellido_apoderado_suplente: ['', [Validators.required, Validators.minLength(3)]],
      segundo_apellido_apoderado_suplente: ['', [Validators.required, Validators.minLength(3)]],
      rut_apoderado_suplente: ['', [Validators.required, rutValidator()]],
      telefono_apoderado_suplente: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      correo_apoderado_suplente: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      parentesco_apoderado_suplente: ['', [Validators.required]],
      estado_civil_suplente: ['', [Validators.required]],
      profesion_oficio_suplente: ['', [Validators.required]],
      direccion_suplente: ['', [Validators.required]],
      comuna_suplente: ['', [Validators.required]],
    });

  }

  ngOnInit(): void {
    this.loadInscripciones();

  }
  loadInscripciones() {
    this.inscripcionService.getInscripcion(this.data).subscribe({
      next: (data: IInscripcionMatricula) => {
        const { fecha_matricula_inscripcion, fecha_nacimiento_alumno } = data;

        const fechaMatricula = new Date(fecha_matricula_inscripcion);
        fechaMatricula.setDate(fechaMatricula.getDate() + 1);
        const fechaNacimiento = new Date(fecha_nacimiento_alumno);
        fechaNacimiento.setDate(fechaNacimiento.getDate() + 1);

        data.fecha_matricula_inscripcion = fechaMatricula.toISOString();
        data.fecha_nacimiento_alumno = fechaNacimiento.toISOString();

        this.inscripcionForm.patchValue(data);
      },
      error: (error: any) => {
        console.error('Error fetching inscripciones:', error);
      }
    });
  }



  onSubmit() {
    if (this.inscripcionForm.valid) {
      console.log("VALIDO");
      console.log(this.inscripcionForm.value);

      const {
        enfermedad_cronica_alumno,
        alergia_alimento_alumno,
        alergia_medicamento_alumno
      } = this.inscripcionForm.value;

      this.inscripcionForm.patchValue({
        enfermedad_cronica_alumno: enfermedad_cronica_alumno || 'No',
        alergia_alimento_alumno: alergia_alimento_alumno || 'No',
        alergia_medicamento_alumno: alergia_medicamento_alumno || 'No'
      });

      console.log(this.inscripcionForm.value);


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

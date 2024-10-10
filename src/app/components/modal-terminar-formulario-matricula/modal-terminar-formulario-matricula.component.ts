import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      estudiantes: this.fb.array([this.createEstudianteGroup()]),
      primer_nombre_apoderado: ['', [Validators.required, Validators.minLength(3)]],
      segundo_nombre_apoderado: [''],
      primer_apellido_apoderado: ['', [Validators.required, Validators.minLength(3)]],
      segundo_apellido_apoderado: ['', [Validators.required, Validators.minLength(3)]],
      rut_apoderado: ['', [Validators.required, rutValidator()]],
      telefono_apoderado: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      correo_apoderado: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      parentesco_apoderado: ['', [Validators.required]],
      estado_civil: ['', [Validators.required]],
      // escolaridad: ['', [Validators.required]],
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
  get estudiantes(): FormArray {
    return this.inscripcionForm.get('estudiantes') as FormArray;
  }

  createEstudianteGroup(): FormGroup {
    const estudianteGroup = this.fb.group({
      primer_nombre: ['', [Validators.required, Validators.minLength(3)]],
      segundo_nombre: [''],
      primer_apellido: ['', [Validators.required, Validators.minLength(3)]],
      segundo_apellido: ['', [Validators.required, Validators.minLength(3)]],
      rut: ['', [Validators.required, rutValidator()]],
      genero: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      cursoId: ['', [Validators.required]],
      vive_con: ['', [Validators.required]],
      nacionalidad_alumno: ['', [Validators.required]],
      enfermedad_cronica: [''],
      alergico_alimento: [''],
      alergico_medicamentos: [''],
      prevision: ['', [Validators.required]],
      consultorio_clinica: ['', [Validators.required]],
      es_pae: [false],
      eximir_religion: [false],
      autorizacion_fotografias: [false],
      apto_educacion_fisica: [false],
      observaciones: [''],
    });

    return estudianteGroup;
  }

  addEstudiante(): void {
    this.estudiantes.push(this.createEstudianteGroup());
  }

  removeEstudiante(index: number): void {
    this.estudiantes.removeAt(index);
  }

  ngOnInit(): void {
    this.loadInscripciones();
  }

  loadInscripciones() {
    this.inscripcionService.getInscripcion(this.data).subscribe({
      next: (data: IInscripcionMatricula) => {
        // Formatear las fechas adecuadamente
        const fechaMatricula = new Date(data.fecha_matricula_inscripcion);
        fechaMatricula.setDate(fechaMatricula.getDate() + 1);
        data.fecha_matricula_inscripcion = fechaMatricula.toISOString();

        const fechaNacimiento = new Date(data.fecha_nacimiento_alumno);
        fechaNacimiento.setDate(fechaNacimiento.getDate() + 1);
        data.fecha_nacimiento_alumno = fechaNacimiento.toISOString();

        // Aplicar patchValue para asignar los valores al formulario
        this.inscripcionForm.patchValue({
          id_inscripcion: data.id_inscripcion,
          fecha_matricula_inscripcion: data.fecha_matricula_inscripcion,
          primer_nombre_apoderado: data.primer_nombre_apoderado,
          segundo_nombre_apoderado: data.segundo_nombre_apoderado,
          primer_apellido_apoderado: data.primer_apellido_apoderado,
          segundo_apellido_apoderado: data.segundo_apellido_apoderado,
          rut_apoderado: data.rut_apoderado,
          telefono_apoderado: data.telefono_apoderado,
          correo_apoderado: data.correo_apoderado,
          parentesco_apoderado: data.parentesco_apoderado,
          estado_civil: data.estado_civil,
          profesion_oficio: data.profesion_oficio,
          direccion: data.direccion,
          comuna: data.comuna,
          // Ahora se llena el grupo del estudiante
          estudiantes: [{
            primer_nombre_alumno: data.primer_nombre_alumno,
            segundo_nombre_alumno: data.segundo_nombre_alumno,
            primer_apellido_alumno: data.primer_apellido_alumno,
            segundo_apellido_alumno: data.segundo_apellido_alumno,
            rut_alumno: data.rut_alumno,
            genero_alumno: data.genero_alumno,
            fecha_nacimiento_alumno: data.fecha_nacimiento_alumno,
            curso_alumno: data.curso_alumno,
            vive_con: '',
            nacionalidad_alumno: '',
            prevision_alumno: '',
            consultorio_clinica_alumno: '',
          }]
        });
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




      //********************************** FORMATEAR RUTS ALUMNO APODERADO Y SUPLENTE. */
      //********************************** FORMATEAR RUTS ALUMNO APODERADO Y SUPLENTE. */
      //********************************** FORMATEAR RUTS ALUMNO APODERADO Y SUPLENTE. */
      //********************************** FORMATEAR RUTS ALUMNO APODERADO Y SUPLENTE. */
      //********************************** FORMATEAR RUTS ALUMNO APODERADO Y SUPLENTE. */




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

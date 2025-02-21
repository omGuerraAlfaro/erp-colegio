import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IInscripcionMatricula } from 'src/app/interfaces/inscripcionInterface';
import { InscripcionMatriculaService } from 'src/app/services/InscripcionMatriculaService/InscripcionMatriculaService';
import { rutValidator } from './validator';
import Swal from 'sweetalert2';
import { InfoApoderadoService } from 'src/app/services/apoderadoService/infoApoderado.service';
@Component({
  selector: 'app-modal-ingresar-matricula-apoderado-exist',
  templateUrl: './modal-ingresar-matricula-apoderado-exist.component.html',
  styleUrls: ['./modal-ingresar-matricula-apoderado-exist.component.css']
})
export class ModalIngresarMatriculaApoderadoExistComponent implements OnInit {
  @Output() inscripcionOK = new EventEmitter<void>();
  inscripcionForm: FormGroup;
  inscripcionData: IInscripcionMatricula | null = null;
  isLoading: boolean = false;
  apoderadoSearch = this.fb.control('');
  apoderadoSuplenteSearch = this.fb.control('');
  apoderadoId = ''
  apoderadoSuplenteId = ''

  constructor(
    private fb: FormBuilder,
    private inscripcionService: InscripcionMatriculaService,
    private apoderadoService: InfoApoderadoService,
    public dialogRef: MatDialogRef<ModalIngresarMatriculaApoderadoExistComponent>,
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
      correo_apoderado_suplente: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      parentesco_apoderado_suplente: ['', [Validators.required]],
      estado_civil_suplente: ['', [Validators.required]],
      profesion_oficio_suplente: ['', [Validators.required]],
      direccion_suplente: ['', [Validators.required]],
      comuna_suplente: ['', [Validators.required]],
    });
    this.inscripcionForm.get('primer_nombre_apoderado')?.disable();
    this.inscripcionForm.get('segundo_nombre_apoderado')?.disable();
    this.inscripcionForm.get('primer_apellido_apoderado')?.disable();
    this.inscripcionForm.get('segundo_apellido_apoderado')?.disable();
    this.inscripcionForm.get('rut_apoderado')?.disable();
    this.inscripcionForm.get('telefono_apoderado')?.disable();
    this.inscripcionForm.get('correo_apoderado')?.disable();
    this.inscripcionForm.get('parentesco_apoderado')?.disable();
    this.inscripcionForm.get('estado_civil')?.disable();
    this.inscripcionForm.get('profesion_oficio')?.disable();
    this.inscripcionForm.get('direccion')?.disable();
    this.inscripcionForm.get('comuna')?.disable();

    this.inscripcionForm.get('primer_nombre_apoderado_suplente')?.disable();
    this.inscripcionForm.get('segundo_nombre_apoderado_suplente')?.disable();
    this.inscripcionForm.get('primer_apellido_apoderado_suplente')?.disable();
    this.inscripcionForm.get('segundo_apellido_apoderado_suplente')?.disable();
    this.inscripcionForm.get('rut_apoderado_suplente')?.disable();
    this.inscripcionForm.get('telefono_apoderado_suplente')?.disable();
    this.inscripcionForm.get('correo_apoderado_suplente')?.disable();
    this.inscripcionForm.get('parentesco_apoderado_suplente')?.disable();
    this.inscripcionForm.get('estado_civil_suplente')?.disable();
    this.inscripcionForm.get('profesion_oficio_suplente')?.disable();
    this.inscripcionForm.get('direccion_suplente')?.disable();
    this.inscripcionForm.get('comuna_suplente')?.disable();
  }
  get estudiantes(): FormArray {
    return this.inscripcionForm.get('estudiantes') as FormArray;
  }

  createEstudianteGroup(): FormGroup {
    const estudianteGroup = this.fb.group({
      primer_nombre_alumno: ['', [Validators.required, Validators.minLength(3)]],
      segundo_nombre_alumno: [''],
      primer_apellido_alumno: ['', [Validators.required, Validators.minLength(3)]],
      segundo_apellido_alumno: ['', [Validators.required, Validators.minLength(3)]],
      rut_alumno: ['', [Validators.required, rutValidator()]],
      genero_alumno: ['', [Validators.required]],
      fecha_nacimiento_alumno: ['', [Validators.required]],
      cursoId: ['', [Validators.required]],
      vive_con: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      enfermedad_cronica_alumno: [''],
      alergico_alimento_alumno: [''],
      alergico_medicamentos_alumno: [''],
      prevision_alumno: ['', [Validators.required]],
      consultorio_clinica_alumno: ['', [Validators.required]],
      es_pae: [false],
      eximir_religion: [false],
      autorizacion_fotografias: [false],
      apto_educacion_fisica: [false],
      observaciones_alumno: [''],
    });
    estudianteGroup.get('fecha_nacimiento_alumno')?.valueChanges.subscribe(value => {
      if (value) {
        const formattedDate = this.formatDate(value);
        estudianteGroup.get('fecha_nacimiento_alumno')?.setValue(formattedDate, { emitEvent: false });
      }
    });
    return estudianteGroup;
  }

  ngOnInit(): void {
  }

  formatDate(date: string): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }

    return [year, month, day].join('-');
  }

  addEstudiante(): void {
    this.estudiantes.push(this.createEstudianteGroup());
  }

  removeEstudiante(index: number): void {
    this.estudiantes.removeAt(index);
  }

  splitRut(rut: string): { rut: string, dv: string } {
    const [rutBody, dv] = rut.split('-');
    return { rut: rutBody, dv: dv.toUpperCase() };
  }

  onSubmit() {
    console.log("No VALIDO");

    if (this.inscripcionForm.valid) {
      this.isLoading = true;
      console.log("VALIDO");
      const formValue = this.inscripcionForm.value;

      console.log(formValue);

      const apoderadoId = this.apoderadoId;
      const apoderadoSuplenteId = this.apoderadoSuplenteId;

      const estudiantesFormateados = formValue.estudiantes.map((estudiante: any) => {
        const { rut, dv } = this.splitRut(estudiante.rut_alumno);
        const { rut_alumno, genero_alumno, ...rest } = estudiante;

        const genero = genero_alumno === 'Femenino' ? 'F' : genero_alumno === 'Masculino' ? 'M' : genero_alumno;

        return {
          ...rest,
          rut,
          dv,
          genero_alumno: genero
        };
      });

      const formattedData = {
        apoderadoId,
        apoderadoSuplenteId,
        estudiantes: estudiantesFormateados
      };

      console.log("Datos a enviar:", formattedData);

      this.inscripcionService.postAgregarEstudiante(formattedData).subscribe({
        next: (data: any) => {
          this.isLoading = false;
          console.log("INSERT OK");
          console.log(data);

          Swal.fire({
            title: 'Matrícula Creada',
            html: (() => {
              let estudiantesHtml = '<div style="text-align: left;">' +
                '<p><strong style="color: #2c3e50;">Estudiantes Matriculados:</strong></p>' +
                '<ul style="list-style-type: disc; padding-left: 20px;">';

              data.forEach((est: any) => {
                estudiantesHtml += `<li>${est.primer_nombre_alumno} ${est.segundo_nombre_alumno} 
                                    ${est.primer_apellido_alumno} ${est.segundo_apellido_alumno}</li>`;
              });

              return estudiantesHtml;
            })(),
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });


          // Emitir el evento y cerrar el modal
          this.inscripcionOK.emit();
          this.closeModal();
        },
        error: (error) => {
          this.isLoading = false;
          console.error(error);

          // Mostrar alerta en caso de error
          Swal.fire({
            title: 'Error',
            text: 'Hubo un error al procesar la matrícula. Por favor, inténtalo nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      });

    } else {
      this.inscripcionForm.markAllAsTouched();
      alert('Por favor completa todos los campos obligatorios.');
    }
  }


  buscarApoderado() {
    const busqueda = this.apoderadoSearch.value;
    const rutSinDigito = busqueda?.split('-')[0];

    if (rutSinDigito) {
      this.apoderadoService.getInfoApoderado2(rutSinDigito).subscribe({
        next: (apoderado: any) => {
          if (apoderado) {
            this.apoderadoId = apoderado.id;

            // Carga los datos en el formulario
            this.inscripcionForm.patchValue({
              primer_nombre_apoderado: apoderado.primer_nombre_apoderado,
              segundo_nombre_apoderado: apoderado.segundo_nombre_apoderado,
              primer_apellido_apoderado: apoderado.primer_apellido_apoderado,
              segundo_apellido_apoderado: apoderado.segundo_apellido_apoderado,
              rut_apoderado: apoderado.rut + '-' + apoderado.dv,
              telefono_apoderado: apoderado.telefono_apoderado,
              correo_apoderado: apoderado.correo_apoderado,
              parentesco_apoderado: apoderado.parentesco_apoderado,
              estado_civil: apoderado.estado_civil,
              profesion_oficio: apoderado.profesion_oficio,
              direccion: apoderado.direccion,
              comuna: apoderado.comuna,
            });
          } else {
            Swal.fire({
              title: 'No se encontró el apoderado',
              text: 'Verifica que el dato ingresado sea correcto.',
              icon: 'warning',
              confirmButtonText: 'Aceptar'
            });
          }
        },
        error: (error) => {
          console.error('Error al buscar el apoderado:', error);
          Swal.fire({
            title: 'No se encontró el apoderado',
            text: 'Verifica que el dato ingresado sea correcto.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      alert('Por favor, ingresa un dato para buscar.');
    }
  }

  buscarApoderadoSuplente() {
    const busqueda = this.apoderadoSuplenteSearch.value;
    const rutSinDigito = busqueda?.split('-')[0];

    if (rutSinDigito) {
      this.apoderadoService.getInfoApoderadoSuplente(rutSinDigito).subscribe({
        next: (apoderado: any) => {
          if (apoderado) {
            // Carga los datos en el formulario
            this.apoderadoSuplenteId = apoderado.id;

            this.inscripcionForm.patchValue({
              primer_nombre_apoderado_suplente: apoderado.primer_nombre_apoderado_suplente,
              segundo_nombre_apoderado_suplente: apoderado.segundo_nombre_apoderado_suplente,
              primer_apellido_apoderado_suplente: apoderado.primer_apellido_apoderado_suplente,
              segundo_apellido_apoderado_suplente: apoderado.segundo_apellido_apoderado_suplente,
              rut_apoderado_suplente: apoderado.rut_apoderado_suplente + '-' + apoderado.dv_apoderado_suplente,
              telefono_apoderado_suplente: apoderado.telefono_apoderado_suplente,
              correo_apoderado_suplente: apoderado.correo_apoderado_suplente,
              parentesco_apoderado_suplente: apoderado.parentesco_apoderado_suplente,
              estado_civil_suplente: apoderado.estado_civil_suplente,
              profesion_oficio_suplente: apoderado.profesion_oficio_suplente,
              direccion_suplente: apoderado.direccion_suplente,
              comuna_suplente: apoderado.comuna_suplente,
            });
          } else {
            Swal.fire({
              title: 'No se encontró el apoderado',
              text: 'Verifica que el dato ingresado sea correcto.',
              icon: 'warning',
              confirmButtonText: 'Aceptar'
            });
          }
        },
        error: (error) => {
          console.error('Error al buscar el apoderado:', error);
          Swal.fire({
            title: 'No se encontró el apoderado',
            text: 'Verifica que el dato ingresado sea correcto.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    } else {
      alert('Por favor, ingresa un dato para buscar.');
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

}

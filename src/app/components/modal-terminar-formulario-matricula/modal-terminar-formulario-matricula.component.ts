import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IInscripcionMatricula } from 'src/app/interfaces/inscripcionInterface';
import { InscripcionMatriculaService } from 'src/app/services/InscripcionMatriculaService/InscripcionMatriculaService';
import { rutValidator } from './validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-terminar-formulario-matricula',
  templateUrl: './modal-terminar-formulario-matricula.component.html',
  styleUrls: ['./modal-terminar-formulario-matricula.component.css']
})
export class ModalTerminarFormularioMatriculaComponent implements OnInit {
  @Output() inscripcionOK = new EventEmitter<void>();
  inscripcionForm: FormGroup;
  inscripcionData: IInscripcionMatricula | null = null;
  isLoading: boolean = false;

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
      correo_apoderado_suplente: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
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
      alergia_alimento_alumno: [''],
      alergia_medicamento_alumno: [''],
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
            cursoId: data.curso_alumno,
            vive_con: '',
            nacionalidad: '',
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

  // Función para dividir el RUT en cuerpo y dígito verificador (DV)
  splitRut(rut: string): { rut: string, dv: string } {
    const [rutBody, dv] = rut.split('-'); // Divide el RUT por el guion
    return { rut: rutBody, dv: dv.toUpperCase() }; // Retorna el cuerpo y el DV en mayúscula
  }

  onSubmit() {
    console.log("No VALIDO");

    if (this.inscripcionForm.valid) {
      this.isLoading = true; 
      console.log("VALIDO");

      // Obtener los valores del formulario al inicio
      const formValue = this.inscripcionForm.value;

      console.log(formValue);

      // Separar el RUT y el DV de apoderado y suplente
      const rutApoderado = this.splitRut(formValue.rut_apoderado);
      const rutApoderadoSuplente = this.splitRut(formValue.rut_apoderado_suplente);

      // Desestructurar el rut_apoderado para excluirlo y mantener el resto
      const { rut_apoderado, rut_apoderado_suplente, ...restApoderado } = formValue;

      // Actualizar el formulario con el RUT del apoderado como `rut`
      this.inscripcionForm.patchValue({
        rut: rutApoderado.rut,
        dv: rutApoderado.dv,
        rut_apoderado_suplente: rutApoderadoSuplente.rut,
        dv_apoderado_suplente: rutApoderadoSuplente.dv,
      });

      // Recorrer el array de estudiantes y formatear cada RUT, eliminando `rut_alumno`
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
        ...restApoderado,
        rut: rutApoderado.rut,
        dv: rutApoderado.dv,
        rut_apoderado_suplente: rutApoderadoSuplente.rut,
        dv_apoderado_suplente: rutApoderadoSuplente.dv,
        estudiantes: estudiantesFormateados
      };

      console.log("Datos a enviar:", formattedData);

      this.inscripcionService.postNuevaMatricula(formattedData).subscribe({
        next: (data: any) => {
          this.isLoading = false;
          console.log("INSERT OK");
          console.log(data);

          // Extraer datos
          const usuario = data.usuario[0];
          const apoderado = data.apoderado;
          const apoderadoSuplente = data.apoderadoSuplente;
          const estudiantes = data.estudiantes.map((est: any) => `${est.primer_nombre_alumno} ${est.segundo_nombre_alumno} ${est.primer_apellido_alumno} ${est.segundo_apellido_alumno}`).join(', ');

          // Levantar SweetAlert
          Swal.fire({
            title: 'Matrícula Creada',
            html: `
              <div style="text-align: left;">
                <p><strong style="color: #2c3e50;">Usuario Creado:</strong> ${usuario.username}</p>
                <p><strong style="color: #2c3e50;">Correo Electrónico:</strong> ${usuario.correo_electronico}</p>
                <p><strong style="color: #2c3e50;">Apoderado:</strong> 
                  ${apoderado.primer_nombre_apoderado} ${apoderado.segundo_nombre_apoderado} 
                  ${apoderado.primer_apellido_apoderado} ${apoderado.segundo_apellido_apoderado}
                </p>
                <p><strong style="color: #2c3e50;">Apoderado Suplente:</strong> 
                  ${apoderadoSuplente.primer_nombre_apoderado_suplente} 
                  ${apoderadoSuplente.segundo_nombre_apoderado_suplente} 
                  ${apoderadoSuplente.primer_apellido_apoderado_suplente} 
                  ${apoderadoSuplente.segundo_apellido_apoderado_suplente}
                </p>
                <p><strong style="color: #2c3e50;">Estudiantes Matriculados:</strong></p>
                <ul style="list-style-type: disc; padding-left: 20px;">
                  ${data.estudiantes.map((est:any) => `
                    <li>${est.primer_nombre_alumno} ${est.segundo_nombre_alumno} 
                        ${est.primer_apellido_alumno} ${est.segundo_apellido_alumno}
                    </li>
                  `).join('')}
                </ul>
                <p style="color: #16a085;">Se ha enviado un correo con los detalles de acceso a la aplicación del colegio Andes Chile.</p>
              </div>
            `,

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

    }
  }



  closeModal(): void {
    this.dialogRef.close();
  }
}

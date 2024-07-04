import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApoderadoPostRequest } from 'src/app/interfaces/apoderadoInterface';
import { InfoApoderadoService } from 'src/app/services/apoderadoService/infoApoderado.service';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-nueva-matricula',
  templateUrl: './modal-nueva-matricula.component.html',
  styleUrls: ['./modal-nueva-matricula.component.css']
})
export class ModalNuevaMatriculaComponent implements OnInit {

  @Output() matriculaAgregada = new EventEmitter<void>();

  matriculaForm!: FormGroup;
  cursos: any[] = [];

  updatingRut = false;
  updatingDv = false;

  constructor(
    public dialogRef: MatDialogRef<ModalNuevaMatriculaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private infoApoderadoService: InfoApoderadoService,
    private cursosService: CursosService
  ) { }

  ngOnInit(): void {
    this.matriculaForm = this.fb.group({
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      primer_apellido: ['', Validators.required],
      segundo_apellido: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      rut: ['', [Validators.required, this.validarRut()]],
      dv: ['', [Validators.required, this.validarRut()]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      estado_civil: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      actividad: [''],
      escolaridad: [''],
      estudiantes: this.fb.array([this.createEstudianteGroup()])
    });

    this.loadCursos();

    this.matriculaForm.get('dv')?.valueChanges.subscribe(() => {
      if (!this.updatingDv) {
        this.updatingRut = true;
        this.matriculaForm.get('rut')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        this.updatingRut = false;
      }
    });

    this.matriculaForm.get('rut')?.valueChanges.subscribe(() => {
      if (!this.updatingRut) {
        this.updatingDv = true;
        this.matriculaForm.get('dv')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        this.updatingDv = false;
      }
    });
  }

  loadCursos(): void {
    this.cursosService.getAllCursos().subscribe(
      (data: any) => {
        this.cursos = data;
      },
      (error: any) => {
        console.error('Error al cargar los cursos', error);
      }
    );
  }

  get estudiantes(): FormArray {
    return this.matriculaForm.get('estudiantes') as FormArray;
  }

  createEstudianteGroup(): FormGroup {
    const estudianteGroup = this.fb.group({
      primer_nombre: ['', Validators.required],
      segundo_nombre: [''],
      primer_apellido: ['', Validators.required],
      segundo_apellido: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      rut: ['', [Validators.required, this.validarRut()]],
      dv: ['', [Validators.required, this.validarRut()]],
      telefono_contacto: [''],
      genero: ['', Validators.required],
      alergico: [''],
      vive_con: [''],
      enfermedad_cronica: [''],
      cursoId: [0, Validators.required]
    });

    estudianteGroup.get('dv')?.valueChanges.subscribe(() => {
      if (!this.updatingDv) {
        this.updatingRut = true;
        estudianteGroup.get('rut')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        this.updatingRut = false;
      }
    });

    estudianteGroup.get('rut')?.valueChanges.subscribe(() => {
      if (!this.updatingRut) {
        this.updatingDv = true;
        estudianteGroup.get('dv')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        this.updatingDv = false;
      }
    });

    return estudianteGroup;
  }

  addEstudiante(): void {
    this.estudiantes.push(this.createEstudianteGroup());
  }

  removeEstudiante(index: number): void {
    this.estudiantes.removeAt(index);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.matriculaForm.valid) {
      const formValue = this.matriculaForm.value;
      const apoderado = {
        ...formValue,
        estudiantes: formValue.estudiantes.map((estudiante: any) => ({
          ...estudiante,
          telefono_contacto: formValue.telefono
        }))
      };

      const requestBody: ApoderadoPostRequest = {
        apoderados: [apoderado]
      };

      console.log(requestBody);

      this.infoApoderadoService.addApoderado(requestBody).subscribe(
        (response: any) => {
          Swal.fire('Success', 'Matrícula agregada exitosamente', 'success');
          this.matriculaAgregada.emit();
          this.closeModal();
        },
        (error: any) => {
          Swal.fire('Error', 'Hubo un problema al agregar la matrícula', 'error');
        }
      );
    } else {
      this.matriculaForm.markAllAsTouched(); // Marca todos los controles como tocados
      console.log('Formulario no válido');
      this.logInvalidControls(this.matriculaForm);
    }
  }

  logInvalidControls(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.logInvalidControls(control);
      } else if (control && control.invalid) {
        console.log(`Invalid control: ${key}, Errors:`, control.errors);
      }
    });
  }

  validarRut(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) {
        return null;
      }

      const rutControl = parent.get('rut');
      const dvControl = parent.get('dv');
      const rut = rutControl?.value;
      const dv = dvControl?.value.toUpperCase();

      if (!rutControl || !dvControl || !rut || !dv) {
        return null; // Do not validate if either control or field is empty
      }

      const rutCompleto = `${rut}-${dv}`;

      if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rutCompleto)) {
        return { rutInvalido: true };
      }

      const tmp = rutCompleto.split('-');
      const rutSolo = tmp[0];
      let digv = tmp[1].toUpperCase();

      const dvCalculado = this.calculateDV(rutSolo);

      if (dvCalculado !== digv) {
        return { rutInvalido: true };
      }

      return null;
    };
  }

  calculateDV(rut: string): string {
    let suma = 0;
    let multiplo = 2;
    for (let i = rut.length - 1; i >= 0; i--) {
      suma += parseInt(rut[i], 10) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
    const dvEsperado = 11 - (suma % 11);
    if (dvEsperado === 11) return '0';
    if (dvEsperado === 10) return 'K';
    return dvEsperado.toString();
  }
}

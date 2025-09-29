import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { SemestreService } from 'src/app/services/semestreService/semestre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-observacion-alumnos',
  templateUrl: './modal-observacion-alumnos.component.html',
  styleUrls: ['./modal-observacion-alumnos.component.css']
})
export class ModalObservacionAlumnosComponent implements OnInit {

  titulo = 'Observaciones finales por alumno';

  // SIN TIPOS ESTRICTOS (puedes tipar luego si quieres)
  cursos: any[] = [];
  cursoSeleccionadoId: number | null = null;
  cursoSeleccionado: any | null = null;

  loadingCursos = false;
  displayedColumns = ['alumno', 'observacion'];
  maxLengthObservacion = 800;

  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ModalObservacionAlumnosComponent>,
    private cursosService: CursosService,
    private semestreService: SemestreService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      alumnosObservaciones: this.fb.array([]),
      confirmado: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.getAllCursos();
    this.loadCursos();
  }

  getAllCursos(): void {
    this.cursosService.getAllCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        console.log('Cursos cargados:', this.cursos);
      },
      error: (err) => console.error('Error al obtener cursos:', err),
    });
  }

  // Getters convenientes
  get alumnosObservaciones(): FormArray {
    return this.form.get('alumnosObservaciones') as FormArray;
  }
  get confirmadoCtrl(): FormControl {
    return this.form.get('confirmado') as FormControl;
  }

  loadCursos(): void {
    this.loadingCursos = true;

    this.cursosService.getInfoCursoConEstudiantes()
      .pipe(
        map((resp: any) => Array.isArray(resp) ? resp : [resp]),
        // 👇 deja solo cursos con observacionCerrada === false
        map((arr: any[]) => arr.filter(c => !Boolean(c?.observacionCerrada)))
      )
      .subscribe({
        next: (response: any[]) => {
          this.cursos = response || [];
          // si el curso seleccionado ya no existe (porque fue filtrado), limpia selección
          if (this.cursoSeleccionadoId &&
            !this.cursos.some(c => +c.id === +this.cursoSeleccionadoId!)) {
            this.cursoSeleccionadoId = null;
            this.cursoSeleccionado = null;
            this.alumnosObservaciones.clear();
            this.confirmadoCtrl.setValue(false);
          }
        },
        error: (err: any) => console.error('Error cargando cursos:', err),
        complete: () => { this.loadingCursos = false; }
      });
  }


  /** Cambia/recarga el curso actual y rebuild del FormArray */
  onCursoChange(): void {
    const id = this.cursoSeleccionadoId != null ? +this.cursoSeleccionadoId : null;

    this.cursoSeleccionado = (this.cursos || []).find((c: any) => +c?.id === id) || null;

    // Limpia el form
    this.alumnosObservaciones.clear();
    this.confirmadoCtrl.setValue(false);

    if (!this.cursoSeleccionado) return;

    // Ordenar por primer apellido
    const alumnos: any[] = (this.cursoSeleccionado?.estudiantes || []).sort(
      (a: any, b: any) => (a?.primer_apellido_alumno || '').localeCompare(b?.primer_apellido_alumno || '')
    );

    for (const a of alumnos) {
      this.alumnosObservaciones.push(
        this.fb.group({
          alumnoId: [a?.id],
          alumnoNombre: [this.fullName(a)],
          observacion: ['', [Validators.required, Validators.maxLength(this.maxLengthObservacion)]],
        })
      );
    }
  }

  /** Helpers UI */
  fullName(e: any): string {
    const n1 = (e?.primer_nombre_alumno || '').trim();
    const n2 = (e?.segundo_nombre_alumno || '').trim();
    const a1 = (e?.primer_apellido_alumno || '').trim();
    const a2 = (e?.segundo_apellido_alumno || '').trim();
    return [n1, n2, a1, a2].filter(Boolean).join(' ');
  }

  isInvalidObservacion(ix: number): boolean {
    const ctrl = this.alumnosObservaciones.at(ix).get('observacion');
    return !!ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  getErrorObservacion(ix: number): string {
    const ctrl = this.alumnosObservaciones.at(ix).get('observacion');
    if (!ctrl) return '';
    if (ctrl.hasError('required')) return 'Requerido';
    if (ctrl.hasError('maxlength')) return `Máximo ${this.maxLengthObservacion} caracteres`;
    return 'Inválido';
  }

  get puedeGuardar(): boolean {
    return this.form.valid && this.alumnosObservaciones.length > 0 && !!this.cursoSeleccionadoId;
  }
  
  guardar(): void {
    if (!this.puedeGuardar) {
      this.form.markAllAsTouched();
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Al guardar no podrás volver a ingresar ni editar las observaciones.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          cierres: this.alumnosObservaciones.value.map((v: any) => ({
            estudianteId: +v.alumnoId,
            observacion: (v.observacion ?? '').trim()
          }))
        };

        this.semestreService.cierreObservacionMultiple(payload).subscribe({
          next: (res: any) => {
            this.dialogRef.close(true);

            this.cursosService.cambiarEstadoCerrarObservacion(this.cursoSeleccionadoId!).subscribe({
              next: () => {
                console.log('Estado de observación cerrado para el curso:', this.cursoSeleccionadoId);
              },
              error: (err) => {
                console.error('Error al cambiar estado de observación:', err);
              }
            });

            Swal.fire({
              icon: 'success',
              title: 'Observaciones guardadas',
              text: 'Las observaciones se guardaron correctamente.',
              confirmButtonText: 'Aceptar'
            });
          },
          error: (err: any) => {
            console.error('Error guardando observaciones:', err);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un problema guardando las observaciones. Intenta nuevamente.',
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }
    });
  }

  castToNumber(value: any): number | null {
    return value != null ? +value : null;
  }


  cancelar(): void {
    this.dialogRef.close(null);
  }
}

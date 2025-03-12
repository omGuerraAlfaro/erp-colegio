import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import { AsignaturaService } from 'src/app/services/asignaturaService/asignatura.service';
import { NotasService } from 'src/app/services/notaService/nota.service';
import Swal from 'sweetalert2';
import { SemestreService } from 'src/app/services/semestreService/semestre.service';

@Component({
  selector: 'app-cursos-notas',
  templateUrl: './cursos-notas.component.html',
  styleUrls: ['./cursos-notas.component.css'],
})
export class CursosNotasComponent implements OnInit {
  cursos: any[] = [];
  asignaturas: any[] = [];
  cursoSeleccionado: number | null = null;
  asignaturaSeleccionada: number | null = null;
  dataSourceNotas: any[] = [];         // [{ estudiante, evaluaciones: [...], ... }, ...]
  displayedColumns: string[] = [];     // ['alumno', ...evaluaciones, 'acciones']
  distinctEvaluaciones: string[] = []; // ['Algoritmos', 'Estructuras', etc.]

  cargando = false;

  constructor(
    private notasService: NotasService,
    private cursoService: CursosService,
    private asignaturaService: AsignaturaService,
    private semestreService: SemestreService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllCursos();
    this.getAllAsignaturas();
  }

  getAllCursos(): void {
    this.cursoService.getAllCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Error al obtener cursos:', err),
    });
  }

  getAllAsignaturas(): void {
    this.asignaturaService.getAllAsignaturas().subscribe({
      next: (asignaturas) => {
        this.asignaturas = asignaturas;
        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Error al obtener asignaturas:', err),
    });
  }

  buscarNotas(): void {
    if (!this.cursoSeleccionado || !this.asignaturaSeleccionada) {
      Swal.fire('Error', 'Por favor, selecciona un curso y una asignatura.', 'error');
      return;
    }
    
    this.dataSourceNotas = [];
    this.displayedColumns = [];
    this.distinctEvaluaciones = [];
    this.cargando = true;
    this.cdRef.markForCheck();

    this.notasService
      .getNotasByCursoAsignatura(this.cursoSeleccionado, this.asignaturaSeleccionada, 1)
      .subscribe({
        next: (respuesta) => {
          // En cuanto recibimos respuesta, detenemos el spinner
          this.cargando = false;
          this.cdRef.markForCheck();

          // Verificamos si no hay evaluaciones
          if (!respuesta || respuesta.length === 0) {
            Swal.fire(
              'Sin Evaluaciones',
              'No existen evaluaciones para este curso y asignatura. Por favor, crea una nueva evaluación para poder registrar las notas.',
              'info'
            );
            // Cortamos el proceso aquí
            return;
          }

          // Si hay evaluaciones, seguimos con el proceso normal
          this.dataSourceNotas = respuesta;
          this.configurarColumnas();
        },
        error: (err) => {
          console.error('Error al obtener notas:', err);
          Swal.fire('Error', 'Ocurrió un problema al cargar las notas.', 'error');
          this.cargando = false;
          this.cdRef.markForCheck();
        },
      });
  }


  configurarColumnas(): void {
    const evaluacionesSet = new Set<string>();
    for (const alumno of this.dataSourceNotas) {
      // Verifica que tenga evaluaciones como array
      if (!alumno.evaluaciones || !Array.isArray(alumno.evaluaciones)) {
        alumno.evaluaciones = [];
      }

      // Recorre las evaluaciones y añade sus nombres a evaluacionesSet
      alumno.evaluaciones.forEach((evalObj: any) => {
        evaluacionesSet.add(evalObj.nombre_evaluacion);
      });
    }

    this.distinctEvaluaciones = Array.from(evaluacionesSet);

    // (Opcional) Crear un objeto vacío si falta alguna evaluación:
    for (const alumno of this.dataSourceNotas) {
      this.distinctEvaluaciones.forEach(nombreEval => {
        // Si no existe la evaluación en el array, la añadimos
        if (!alumno.evaluaciones.find((e: any) => e.nombre_evaluacion === nombreEval)) {
          alumno.evaluaciones.push({
            nombre_evaluacion: nombreEval,
            nota: null,
            // otras propiedades que necesites
          });
        }
      });
    }

    this.displayedColumns = ['alumno', ...this.distinctEvaluaciones, 'acciones'];
  }


  /**
  * Retorna la nota para la columna "nombreEvaluacion". Si no la encuentra, retorna '-' o null.
  */
  getNotaDeEvaluacion(alumno: any, nombreEvaluacion: string): number | null {
    if (!alumno.evaluaciones) return null;
    const evalObj = alumno.evaluaciones.find(
      (e: any) => e.nombre_evaluacion === nombreEvaluacion
    );
    return evalObj ? evalObj.nota : null;
  }

  isNotaBaja(alumno: any, nombreEvaluacion: string): boolean {
    const valor = this.getNotaDeEvaluacion(alumno, nombreEvaluacion);
    let notaNumber: number;
    if (typeof valor === 'number') {
      notaNumber = valor;
    } else if (typeof valor === 'string') {
      const cleanedValue = (valor as string).replace(',', '.');
      notaNumber = parseFloat(cleanedValue);
    } else {
      notaNumber = NaN;
    }

    return !isNaN(notaNumber) && notaNumber < 4;
  }


  onNotaChange(event: any, alumno: any, nombreEvaluacion: string) {
    // Reemplaza coma por punto
    const cleanedValue = event.target.value?.replace(',', '.');
    const newValue = parseFloat(cleanedValue);

    if (!alumno.evaluaciones) return;
    const evalObj = alumno.evaluaciones.find(
      (e: any) => e.nombre_evaluacion === nombreEvaluacion
    );
    if (evalObj) {
      evalObj.nota = isNaN(newValue) ? null : newValue;

      // Aplicar color directamente al elemento input
      if (!isNaN(newValue)) {
        event.target.style.color = (newValue < 4) ? 'red' : 'blue';
      } else {
        event.target.style.color = 'blue';
      }

      this.cdRef.detectChanges();
    }
  }

  onInputMask(event: any) {
    const inputValue: string = event.target.value;
    const pattern = /^([1-6](\.\d)?|7(\.0)?)?$/;
    // Si el valor actual no calza con el patrón y no está vacío, eliminamos el último carácter.
    if (!pattern.test(inputValue) && inputValue !== '') {
      event.target.value = inputValue.slice(0, -1);
    }
  }


  /**
   * Ejemplo de acción para Editar/Calcular la nota de un alumno (por fila).
   */
  editarNota(alumno: any): void {
    Swal.fire('Editar Nota', `Alumno: ${alumno.estudiante}`, 'info');
  }

  agregarEvaluacion(): void {
    if (!this.cursoSeleccionado || !this.asignaturaSeleccionada) {
      Swal.fire('Advertencia', 'Por favor, selecciona un curso y una asignatura.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Agregar Evaluación',
      html: `
        <input id="nombreEvaluacion" class="swal2-input" placeholder="Nombre de la evaluación">
        <select id="tipoEvaluacion" class="swal2-select">
          <option value="1">Nota Parcial</option>
          <option value="2">Nota Tarea</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      preConfirm: () => {
        const nombreInput = document.getElementById('nombreEvaluacion') as HTMLInputElement;
        const tipoEvaluacionSelect = document.getElementById('tipoEvaluacion') as HTMLSelectElement;

        if (!nombreInput.value.trim()) {
          Swal.showValidationMessage('El nombre de la evaluación es obligatorio');
          return false;
        }

        return {
          nombre: nombreInput.value.trim(),
          tipoEvaluacionId: parseInt(tipoEvaluacionSelect.value, 10),
        };
      }
    }).then((result) => {
      if (!result.isConfirmed || !result.value) {
        return; // Si el usuario cancela o hay un error, salimos.
      }

      const { nombre, tipoEvaluacionId } = result.value; // Ahora TypeScript reconoce que result.value tiene datos.

      // Obtener el semestre actual a través de getSemestre()
      const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      this.semestreService.getSemestre(fechaActual).subscribe({
        next: (res) => {
          const semestreId = res.id_semestre;

          if (!this.cursoSeleccionado || !this.asignaturaSeleccionada) {
            Swal.fire('Error', 'Debe seleccionar un curso y una asignatura.', 'error');
            return;
          }

          // Crear la evaluación con los datos obtenidos
          this.notasService.createEvaluacion({
            nombreEvaluacion: nombre,
            asignaturaId: this.asignaturaSeleccionada,
            cursoId: this.cursoSeleccionado,
            semestreId: semestreId,
            tipoEvaluacionId: tipoEvaluacionId,
          }).subscribe({
            next: () => {
              Swal.fire('OK', 'Evaluación creada con éxito.', 'success');
              this.buscarNotas(); // Recargar tabla
            },
            error: (err) => {
              console.error('Error al crear evaluación:', err);
              Swal.fire('Error', 'No se pudo crear la evaluación.', 'error');
            },
          });
        },
        error: () => {
          Swal.fire('Error', 'No se pudo obtener el semestre.', 'error');
        }
      });
    });
  }



  /**
   * Guarda los cambios de notas en el backend.
   * Necesitas un método en tu servicio que reciba la estructura de "dataSourceNotas"
   * o un objeto transformado para el backend.
   */
  guardarNotas(): void {
    // Podrías necesitar estudianteId, evaluacionId, etc., dependiendo de tu API.
    this.notasService.actualizarNotas(this.dataSourceNotas).subscribe({
      next: () => {
        Swal.fire('Guardado', 'Notas guardadas exitosamente', 'success');
      },
      error: (err) => {
        console.error('Error al guardar notas:', err);
        Swal.fire('Error', 'No se pudieron guardar las notas', 'error');
      },
    });
  }

}

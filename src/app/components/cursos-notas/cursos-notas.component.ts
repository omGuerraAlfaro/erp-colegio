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
  parciales: any[] = [];
  tareas: any[] = [];
  displayedColumnsParciales: string[] = [];
  displayedColumnsTareas: string[] = [];


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
    // 1. Recolectar todas las evaluaciones de todos los alumnos
    const allEvaluations: any[] = [];
    this.dataSourceNotas.forEach(alumno => {
      if (Array.isArray(alumno.evaluaciones)) {
        allEvaluations.push(...alumno.evaluaciones);
      }
    });

    // 2. Eliminar evaluaciones duplicadas usando el id_evaluacion como clave
    const distinctEvalMap = new Map<number, any>();
    allEvaluations.forEach(ev => {
      if (!distinctEvalMap.has(ev.id_evaluacion)) {
        distinctEvalMap.set(ev.id_evaluacion, ev);
      }
    });
    const distinctEvaluations = Array.from(distinctEvalMap.values());

    // 3. Ordenar evaluaciones:
    //    Primero por tipo (1 = Parcial, 2 = Tarea) y luego por id_evaluacion
    distinctEvaluations.sort((a, b) => {
      const tipoA = a.tipoEvaluacion?.id ?? Infinity;
      const tipoB = b.tipoEvaluacion?.id ?? Infinity;
      if (tipoA !== tipoB) {
        return tipoA - tipoB;
      }
      return a.id_evaluacion - b.id_evaluacion;
    });

    // 4. Separar evaluaciones en parciales y tareas
    this.parciales = distinctEvaluations.filter(ev => ev.tipoEvaluacion?.id === 1);
    this.tareas = distinctEvaluations.filter(ev => ev.tipoEvaluacion?.id === 2);

    // 5. Configurar las columnas para la tabla:
    // Se incluye 'numero' y 'alumno' al principio,
    // luego las evaluaciones parciales, después una columna separadora 'separator'
    // y finalmente las evaluaciones de tareas.
    this.displayedColumns = [
      'numero',
      'alumno',
      ...this.parciales.map(ev => ev.nombre_evaluacion),
      'separator',
      ...this.tareas.map(ev => ev.nombre_evaluacion)
    ];

    // 6. Completar evaluaciones faltantes para cada alumno (para asegurar que tengan todas las columnas)
    for (const alumno of this.dataSourceNotas) {
      if (!Array.isArray(alumno.evaluaciones)) {
        alumno.evaluaciones = [];
      }
      distinctEvaluations.forEach(ev => {
        const existe = alumno.evaluaciones.find((e: any) => e.id_evaluacion === ev.id_evaluacion);
        if (!existe) {
          alumno.evaluaciones.push({
            id_evaluacion: ev.id_evaluacion,
            nombre_evaluacion: ev.nombre_evaluacion,
            nota: null,
            fecha: null,
            tipoEvaluacion: ev.tipoEvaluacion,
          });
        }
      });
    }
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

  // Devuelve true si la nota es baja (< 4)
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

  // Función auxiliar que retorna el color según la nota
  getColorForNota(alumno: any, nombreEvaluacion: string): string {
    return this.isNotaBaja(alumno, nombreEvaluacion) ? 'red' : 'blue';
  }

  onNotaChange(event: any, alumno: any, nombreEvaluacion: string) {
    console.log(event);

    // Reemplaza coma por punto
    const cleanedValue = event.target.value?.replace(',', '.');
    const newValue = parseFloat(cleanedValue);

    if (!alumno.evaluaciones) return;
    const evalObj = alumno.evaluaciones.find(
      (e: any) => e.nombre_evaluacion === nombreEvaluacion
    );
    if (evalObj) {
      evalObj.nota = isNaN(newValue) ? null : newValue;

      // Asigna el color usando la función getColorForNota
      event.target.style.color = isNaN(newValue) ? 'blue' : this.getColorForNota(alumno, nombreEvaluacion);

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


  guardarNotas(): void {
    const notasAGuardar: any = [];

    this.dataSourceNotas.forEach((estudiante) => {
      estudiante.evaluaciones.forEach((evaluacion: any) => {
        // Si la nota está vacía o undefined, asignar null
        const notaValue = (evaluacion.nota === "" || evaluacion.nota === undefined || evaluacion.nota === null)
          ? null
          : Number(evaluacion.nota);

        notasAGuardar.push({
          estudianteId: estudiante.id_estudiante,
          evaluacionId: evaluacion.id_evaluacion,
          nota: notaValue,  // Si la nota está vacía, se asigna null
          fecha: evaluacion.fecha ? new Date(evaluacion.fecha) : new Date(),
        });
      });
    });

    if (notasAGuardar.length === 0) {
      Swal.fire('Aviso', 'No hay notas para guardar', 'info');
      return;
    }

    this.notasService.createNota(notasAGuardar).subscribe({
      next: () => {
        Swal.fire('Guardado', 'Todas las notas se guardaron exitosamente', 'success');
      },
      error: (err) => {
        console.error('Error al guardar notas:', err);
        Swal.fire('Error', 'No se pudieron guardar las notas', 'error');
      },
    });
  }




  getEvaluacionId(nombreEvaluacion: string): number | null {
    // Buscar en el primer estudiante una evaluación con ese nombre para obtener su ID
    const estudiante = this.dataSourceNotas.find(e => e.evaluaciones.some((ev: any) => ev.nombre_evaluacion === nombreEvaluacion));
    if (estudiante) {
      const evaluacion = estudiante.evaluaciones.find((ev: any) => ev.nombre_evaluacion === nombreEvaluacion);
      return evaluacion ? evaluacion.id_evaluacion : null;
    }
    return null;
  }



  abrirOpcionesEvaluacion(idEvaluacion: number | null, nombreEvaluacion: string): void {
    if (!idEvaluacion) {
      Swal.fire('Error', 'No se encontró el ID de la evaluación.', 'error');
      return;
    }

    Swal.fire({
      title: `Opciones para ${nombreEvaluacion}`,
      showCancelButton: true,
      confirmButtonText: 'Editar Nombre',
      cancelButtonText: 'Eliminar Evaluación',
      showDenyButton: true,
      denyButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.editarNombreEvaluacion(idEvaluacion, nombreEvaluacion);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.eliminarEvaluacion(idEvaluacion);
      }
    });
  }

  editarNombreEvaluacion(idEvaluacion: number, nombreEvaluacion: string): void {
    Swal.fire({
      title: 'Editar Nombre de Evaluación',
      input: 'text',
      inputLabel: 'Nuevo Nombre',
      inputValue: nombreEvaluacion,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      preConfirm: (nuevoNombre) => {
        if (!nuevoNombre.trim()) {
          Swal.showValidationMessage('El nombre no puede estar vacío.');
          return false;
        }
        return nuevoNombre.trim();
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoNombre = result.value;
        this.notasService.editarNombreEvaluacion(idEvaluacion, nuevoNombre).subscribe({
          next: () => {
            Swal.fire('Actualizado', 'El nombre de la evaluación se ha actualizado.', 'success');
            this.buscarNotas(); // Recargar la lista
          },
          error: (err) => {
            console.error('Error al actualizar evaluación:', err);
            Swal.fire('Error', 'No se pudo actualizar la evaluación.', 'error');
          }
        });
      }
    });
  }

  eliminarEvaluacion(idEvaluacion: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la evaluación y sus notas asociadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.notasService.eliminarEvaluacion(idEvaluacion).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'La evaluación ha sido eliminada.', 'success');
            this.buscarNotas(); // Recargar la lista
          },
          error: (err) => {
            console.error('Error al eliminar evaluación:', err);
            Swal.fire('Error', 'No se pudo eliminar la evaluación.', 'error');
          }
        });
      }
    });
  }



}

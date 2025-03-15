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
  finalParciales: any[] = [];
  finalTareas: any[] = [];
  final: any[] = [];
  displayedColumnsParciales: string[] = [];
  displayedColumnsTareas: string[] = [];



  editandoEv: boolean = false;
  borrandoEv: boolean = false;
  guardandoEv: boolean = false;
  guardando: boolean = false;
  guardando2: boolean = false;
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
    this.finalParciales = distinctEvaluations.filter(ev => ev.tipoEvaluacion?.id === 3);
    this.finalTareas = distinctEvaluations.filter(ev => ev.tipoEvaluacion?.id === 4);
    this.final = distinctEvaluations.filter(ev => ev.tipoEvaluacion?.id === 5);

    // 5. Configurar las columnas para la tabla:
    // Se incluye 'numero' y 'alumno' al principio,
    // luego las evaluaciones parciales, después una columna separadora 'separator'
    // y finalmente las evaluaciones de tareas.
    this.displayedColumns = [
      'numero',
      'alumno',
      ...this.parciales.map(ev => ev.nombre_evaluacion),
    ];

    if (this.tareas && this.tareas.length > 0) {
      this.displayedColumns.push('separator', ...this.tareas.map(ev => ev.nombre_evaluacion));
    }

    if (this.finalParciales && this.finalParciales.length > 0) {
      this.displayedColumns.push('separatorFinal1', ...this.finalParciales.map(ev => ev.nombre_evaluacion));
    }

    // Si se necesitan las evaluaciones de tareas finales, se agregan sin separador (o con su separador si corresponde)
    this.displayedColumns.push(...this.finalTareas.map(ev => ev.nombre_evaluacion));

    // Se añade la última separación y evaluaciones finales
    if (this.finalParciales && this.finalParciales.length > 0) {
      this.displayedColumns.push('separatorFinal2', ...this.final.map(ev => ev.nombre_evaluacion));
    }


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

      this.guardandoEv = true;
      const { nombre, tipoEvaluacionId } = result.value; // Ahora TypeScript reconoce que result.value tiene datos.

      // Obtener el semestre actual a través de getSemestre()
      const fechaActual = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      this.semestreService.getSemestre(fechaActual).subscribe({
        next: (res) => {
          const semestreId = res.id_semestre;

          if (!this.cursoSeleccionado || !this.asignaturaSeleccionada) {
            this.guardandoEv = false;
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
              this.guardandoEv = false;
              Swal.fire('OK', 'Evaluación creada con éxito.', 'success');
              this.buscarNotas(); // Recargar tabla
            },
            error: (err) => {
              this.guardandoEv = false;
              console.error('Error al crear evaluación:', err);
              Swal.fire('Error', 'No se pudo crear la evaluación.', 'error');
            },
          });
        },
        error: () => {
          this.guardandoEv = false;
          Swal.fire('Error', 'No se pudo obtener el semestre.', 'error');
        }
      });
    });
  }


  guardarNotas(): void {
    this.guardando = true;
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
      this.guardando = false;
      Swal.fire('Aviso', 'No hay notas para guardar', 'info');
      return;
    }

    this.notasService.createNota(notasAGuardar).subscribe({
      next: () => {
        this.guardando = false;
        Swal.fire('Guardado', 'Todas las notas se guardaron exitosamente', 'success');
        this.buscarNotas();
      },
      error: (err) => {
        this.guardando = false;
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
        this.editandoEv = true;
        const nuevoNombre = result.value;
        this.notasService.editarNombreEvaluacion(idEvaluacion, nuevoNombre).subscribe({
          next: () => {
            this.editandoEv = false;
            Swal.fire('Actualizado', 'El nombre de la evaluación se ha actualizado.', 'success');
            this.buscarNotas(); // Recargar la lista
          },
          error: (err) => {
            this.editandoEv = false;
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
        this.borrandoEv = true;
        this.notasService.eliminarEvaluacion(idEvaluacion).subscribe({
          next: () => {
            this.borrandoEv = false;
            Swal.fire('Eliminado', 'La evaluación ha sido eliminada.', 'success');
            this.buscarNotas(); // Recargar la lista
          },
          error: (err) => {
            this.borrandoEv = false;
            console.error('Error al eliminar evaluación:', err);
            Swal.fire('Error', 'No se pudo eliminar la evaluación.', 'error');
          }
        });
      }
    });
  }

  cierreSemestre(): void {
    // Primero, confirmamos con SweetAlert si el usuario desea continuar
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se generarán las notas finales para este curso y asignatura.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar semestre',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // El usuario confirmó, proceder a calcular y guardar
        this.guardando2 = true;
        this.calcularYGuardarFinales();
      }
    });
  }

  calcularYGuardarFinales(): void {
    const fechaActual = new Date().toISOString().split('T')[0];
    this.semestreService.getSemestre(fechaActual).subscribe({
      next: (res) => {
        const semestreId = res.id_semestre;

        // 1. Verificamos si hay alguna evaluación de tipo parcial o tarea con nota vacía
        const existeNotaVacia = this.dataSourceNotas.some((alumno: any) => {
          return alumno.evaluaciones.some((ev: any) => {
            const esParcialOTarea = ev.tipoEvaluacion?.id === 1 || ev.tipoEvaluacion?.id === 2;
            const notaVacia = ev.nota === null || ev.nota === 0; // Ajusta la condición según tu criterio
            return esParcialOTarea && notaVacia;
          });
        });

        if (existeNotaVacia) {
          this.guardando2 = false;
          Swal.fire('Aviso', 'Existen notas de parciales o tareas que están vacías. No se puede generar el cálculo.', 'info');
          return;
        }

        // 2. Si pasa la verificación, calculamos los promedios
        const estudiantesData = this.dataSourceNotas.map((alumno: any) => {
          const evaluacionesParciales = alumno.evaluaciones.filter(
            (ev: any) => ev.tipoEvaluacion?.id === 1 && ev.nota != null
          );
          const evaluacionesTareas = alumno.evaluaciones.filter(
            (ev: any) => ev.tipoEvaluacion?.id === 2 && ev.nota != null
          );

          const promedioParciales = this.calcularPromedio(evaluacionesParciales);
          const promedioTareas = this.calcularPromedio(evaluacionesTareas);

          let notaFinal = null;
          if (promedioParciales !== null && promedioTareas !== null) {
            notaFinal = (promedioParciales + promedioTareas) / 2;
          } else if (promedioParciales !== null) {
            notaFinal = promedioParciales;
          } else if (promedioTareas !== null) {
            notaFinal = promedioTareas;
          }

          return {
            estudianteId: alumno.id_estudiante,
            notaFinalParcial: promedioParciales,
            notaFinalTarea: promedioTareas,
            notaFinal: notaFinal,
          };
        });

        // 3. Verificamos que al menos uno de los estudiantes tenga una nota final
        const tieneNotas = estudiantesData.some(est =>
          est.notaFinalParcial !== null || est.notaFinalTarea !== null || est.notaFinal !== null
        );
        if (!tieneNotas) {
          this.guardando2 = false;
          Swal.fire('Aviso', 'No hay notas para generar finales.', 'info');
          return;
        }

        // 4. Construimos el DTO para enviarlo al backend
        const cierreSemestreDto = {
          cursoId: this.cursoSeleccionado,
          asignaturaId: this.asignaturaSeleccionada,
          semestreId: semestreId,
          estudiantes: estudiantesData,
        };

        // 5. Llamamos al servicio para cerrar el semestre
        this.notasService.cierreSemestre(cierreSemestreDto).subscribe({
          next: () => {
            this.guardando2 = false;
            Swal.fire('Éxito', 'Se han generado las notas finales correctamente.', 'success');
            this.buscarNotas(); // Para recargar la tabla o actualizar la vista
          },
          error: (err) => {
            this.guardando2 = false;
            console.error('Error al guardar notas finales:', err);
            Swal.fire('Error', 'No se pudieron guardar las notas finales.', 'error');
          },
        });
      },
      error: () => {
        this.guardando2 = false;
        Swal.fire('Error', 'No se pudo obtener el semestre.', 'error');
      },
    });
  }


  private calcularPromedio(evaluaciones: any[]): number | null {
    if (!evaluaciones || evaluaciones.length === 0) {
      return null;
    }

    let suma = 0;
    let count = 0;

    for (const ev of evaluaciones) {
      let notaNumber: number;

      if (typeof ev.nota === 'number') {
        // Si ya es número, lo tomamos tal cual
        notaNumber = ev.nota;
      } else if (typeof ev.nota === 'string') {
        // Convertir coma a punto, si existiera
        const cleanedValue = ev.nota.replace(',', '.');
        // Intentar parsear
        notaNumber = parseFloat(cleanedValue);
      } else {
        notaNumber = NaN; // Tipo desconocido o null
      }

      // Si es un número válido, lo sumamos
      if (!isNaN(notaNumber)) {
        suma += notaNumber;
        count++;
      }
    }

    if (count === 0) {
      return null;
    }

    const promedio = suma / count;
    // Redondear a 2 decimales (opcional)
    return +promedio.toFixed(2);
  }


  validarRango(event: any): void {
    let inputValue = event.target.value;

    if (!inputValue) {
      return;
    }

    // Reemplazar coma por punto
    inputValue = inputValue.replace(',', '.');

    // Convertir a número
    let valorNumerico = parseFloat(inputValue);

    // Si no es un número, lo vaciamos
    if (isNaN(valorNumerico)) {
      event.target.value = '';
      return;
    }

    // Limitar a un decimal
    valorNumerico = Math.round(valorNumerico * 10) / 10;

    // Forzar que el valor esté entre 1 y 7
    if (valorNumerico < 1) {
      valorNumerico = 1;
    } else if (valorNumerico > 7) {
      valorNumerico = 7;
    }

    // Devolver el valor corregido al input
    event.target.value = valorNumerico;
  }




}

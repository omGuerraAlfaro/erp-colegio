import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import { AsignaturaService } from 'src/app/services/asignaturaService/asignatura.service';
import { NotasService } from 'src/app/services/notaService/nota.service';
import Swal from 'sweetalert2';
import { SemestreService } from 'src/app/services/semestreService/semestre.service';
import * as e from 'cors';

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
  conceptofinal: any[] = [];
  displayedColumnsParciales: string[] = [];
  displayedColumnsTareas: string[] = [];

  dataSourceNotas2: any[] = [];
  displayedColumns2: string[] = [];
  parciales2: any[] = [];
  tareas2: any[] = [];
  finalParciales2: any[] = [];
  finalTareas2: any[] = [];
  final2: any[] = [];
  conceptofinal2: any[] = [];


  isPreBasica: boolean = false;
  isBasica: boolean = false;

  editandoEv: boolean = false;
  borrandoEv: boolean = false;
  guardandoEv: boolean = false;
  guardando: boolean = false;
  guardando2: boolean = false;
  cargando = false;

  perfil = "";

  primerSemestreCerrado = false;
  segundoSemestreCerrado = false;

  constructor(
    private notasService: NotasService,
    private cursoService: CursosService,
    private asignaturaService: AsignaturaService,
    private semestreService: SemestreService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.semestreService.getEstadoSemestres().subscribe({
      next: (estado: any) => {
        this.primerSemestreCerrado = estado.some((sem: any) => sem.id === 1 && sem.cerrado);
        this.segundoSemestreCerrado = estado.some((sem: any) => sem.id === 2 && sem.cerrado);
        this.cdRef.markForCheck();
      },
    });
    this.getAllCursos();
    this.getAllAsignaturas();
    this.perfil = localStorage.getItem('rol') || '';
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
    this.asignaturaSeleccionada = null;

    if (this.cursoSeleccionado == 1 || this.cursoSeleccionado == 2) {
      this.asignaturaService.getAllAsignaturasPreBasica().subscribe({
        next: (asignaturas) => {
          asignaturas.pop();
          this.asignaturas = asignaturas;
        },
        error: (err) => console.error('Error al obtener asignaturas:', err),
      });
    } else {
      this.asignaturaService.getAllAsignaturasBasica().subscribe({
        next: (asignaturas) => {
          asignaturas.pop();
          this.asignaturas = asignaturas;
        },
        error: (err) => console.error('Error al obtener asignaturas:', err),
      });
    }
  }

  onClickSelect() {
    this.asignaturaSeleccionada = null;
    this.isPreBasica = false;
    this.isBasica = false;
    this.dataSourceNotas = [];
    this.dataSourceNotas2 = [];
    this.displayedColumns = [];
    this.displayedColumns2 = [];
    this.distinctEvaluaciones = [];
  }

  buscarNotas(semestreId: number): void {
    if (!this.cursoSeleccionado || !this.asignaturaSeleccionada) {
      Swal.fire('Error', 'Por favor, selecciona un curso y una asignatura.', 'error');
      return;
    }

    this.isPreBasica = (this.cursoSeleccionado === 1 || this.cursoSeleccionado === 2);
    this.isBasica = (this.cursoSeleccionado >= 3);

    this.dataSourceNotas = [];
    this.dataSourceNotas2 = [];
    this.displayedColumns = [];
    this.displayedColumns2 = [];
    this.distinctEvaluaciones = [];
    this.cargando = true;
    this.cdRef.markForCheck();

    this.notasService
      .getNotasByCursoAsignatura(this.cursoSeleccionado, this.asignaturaSeleccionada, semestreId)
      .subscribe({
        next: (respuesta) => {
          // En cuanto recibimos respuesta, detenemos el spinner
          this.cargando = false;
          this.cdRef.markForCheck();

          // Verificamos si no hay evaluaciones
          if (!respuesta || respuesta.length === 0) {
            Swal.fire(
              'Sin Evaluaciones ',
              'No existen evaluaciones para este curso y asignatura. Por favor, crea una nueva evaluación para poder registrar las notas.',
              'info'
            );
            // Cortamos el proceso aquí
            return;
          }

          if (semestreId === 1) {
            this.dataSourceNotas = respuesta;
          } else {
            this.dataSourceNotas2 = respuesta;
          }

          // Si hay evaluaciones, seguimos con el proceso normal
          this.configurarColumnas(semestreId);
        },
        error: (err) => {
          console.error('Error al obtener notas:', err);
          Swal.fire('Error', 'Ocurrió un problema al cargar las notas.', 'error');
          this.cargando = false;
          this.cdRef.markForCheck();
        },
      });
  }

  configurarColumnas(semestreId: number): void {
    const allEvaluations: any[] = [];
    const dataSource = semestreId === 1 ? this.dataSourceNotas : this.dataSourceNotas2;

    dataSource.forEach(alumno => {
      if (Array.isArray(alumno.evaluaciones)) {
        allEvaluations.push(...alumno.evaluaciones);
      }
    });

    const distinctEvalMap = new Map<number, any>();
    allEvaluations.forEach(ev => {
      if (!distinctEvalMap.has(ev.id_evaluacion)) {
        distinctEvalMap.set(ev.id_evaluacion, ev);
      }
    });

    const distinctEvaluations = Array.from(distinctEvalMap.values()).sort((a, b) => {
      const tipoA = a.tipoEvaluacion?.id ?? Infinity;
      const tipoB = b.tipoEvaluacion?.id ?? Infinity;
      return tipoA !== tipoB ? tipoA - tipoB : a.id_evaluacion - b.id_evaluacion;
    });

    // Separar por tipo
    const parciales = distinctEvaluations.filter(ev => ev.tipoEvaluacion?.id === 1);
    const tareas = distinctEvaluations.filter(ev => ev.tipoEvaluacion?.id === 2);
    const finalParciales = distinctEvaluations.filter(ev => ev.tipoEvaluacion?.id === 3);
    const finalTareas = distinctEvaluations.filter(ev => ev.tipoEvaluacion?.id === 4);
    const final = distinctEvaluations.filter(ev => ev.tipoEvaluacion?.id === 5);
    const conceptoFinal = distinctEvaluations.filter(ev => ev.tipoEvaluacion?.id === 6);

    if (semestreId === 1) {
      this.parciales = parciales;
      this.tareas = tareas;
      this.finalParciales = finalParciales;
      this.finalTareas = finalTareas;
      this.final = final;
      this.conceptofinal = conceptoFinal;

      this.displayedColumns = ['numero', 'alumno', ...parciales.map(ev => ev.nombre_evaluacion)];

      if (tareas.length > 0) {
        this.displayedColumns.push('separator', ...tareas.map(ev => ev.nombre_evaluacion));
      }
      if (finalParciales.length > 0) {
        this.displayedColumns.push('separatorFinal1', ...finalParciales.map(ev => ev.nombre_evaluacion));
      }
      this.displayedColumns.push(...finalTareas.map(ev => ev.nombre_evaluacion));
      if (finalParciales.length > 0) {
        this.displayedColumns.push('separatorFinal2', ...final.map(ev => ev.nombre_evaluacion));
      }
      this.displayedColumns.push(...conceptoFinal.map(ev => ev.nombre_evaluacion));
    } else {
      this.parciales2 = parciales;
      this.tareas2 = tareas;
      this.finalParciales2 = finalParciales;
      this.finalTareas2 = finalTareas;
      this.final2 = final;
      this.conceptofinal2 = conceptoFinal;

      this.displayedColumns2 = ['numero', 'alumno', ...parciales.map(ev => ev.nombre_evaluacion)];

      if (tareas.length > 0) {
        this.displayedColumns2.push('separator', ...tareas.map(ev => ev.nombre_evaluacion));
      }
      if (finalParciales.length > 0) {
        this.displayedColumns2.push('separatorFinal1', ...finalParciales.map(ev => ev.nombre_evaluacion));
      }
      this.displayedColumns2.push(...finalTareas.map(ev => ev.nombre_evaluacion));
      if (finalParciales.length > 0) {
        this.displayedColumns2.push('separatorFinal2', ...final.map(ev => ev.nombre_evaluacion));
      }
      this.displayedColumns2.push(...conceptoFinal.map(ev => ev.nombre_evaluacion));
    }

    // Asegurar que cada alumno tenga todas las evaluaciones
    dataSource.forEach(alumno => {
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
    });
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
    let newValue;
    // Verificamos si el evento viene de un mat-select (usamos event.value)
    if (event.value !== undefined) {
      newValue = event.value; // Será "L", "ML" o "PL"
    } else {
      // Caso del input numérico: reemplazamos coma por punto y convertimos a número
      const cleanedValue = event.target.value?.replace(',', '.');
      newValue = parseFloat(cleanedValue);
    }

    if (!alumno.evaluaciones) return;
    const evalObj = alumno.evaluaciones.find(
      (e: any) => e.nombre_evaluacion === nombreEvaluacion
    );
    if (evalObj) {
      evalObj.nota = newValue;
      // Para números, podrías seguir aplicando estilos o validaciones adicionales
      if (typeof newValue === 'number' && !isNaN(newValue)) {
        event.target.style.color = this.getColorForNota(alumno, nombreEvaluacion);
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

  agregarEvaluacion(semestreId: number): void {
    if (!this.cursoSeleccionado || !this.asignaturaSeleccionada) {
      Swal.fire('Advertencia', 'Por favor, selecciona un curso y una asignatura.', 'warning');
      return;
    }

    let selectHtml: string;
    if (this.cursoSeleccionado === 1 || this.cursoSeleccionado === 2) {
      selectHtml = `
      <select id="tipoEvaluacion" class="swal2-select">
        <option value="1">Concepto</option>
      </select>
    `;
    } else {
      selectHtml = `
      <select id="tipoEvaluacion" class="swal2-select">
        <option value="1">Nota Parcial</option>
        <option value="2">Nota Tarea</option>
      </select>
    `;
    }

    Swal.fire({
      title: 'Agregar Evaluación',
      html: `
      <input id="nombreEvaluacion" class="swal2-input" placeholder="Nombre de la evaluación">
      ${selectHtml}
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
      if (!result.isConfirmed || !result.value) return;

      this.guardandoEv = true;
      const { nombre, tipoEvaluacionId } = result.value;
      const fechaActual = new Date().toISOString().split('T')[0];

      this.semestreService.getSemestre(fechaActual).subscribe({
        next: (res) => {
          // const idSemestre = res.id_semestre;

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

              // Recargar la tabla correspondiente al semestre
              this.buscarNotas(semestreId);
            },
            error: (err) => {
              this.guardandoEv = false;
              console.error('Error al crear evaluación:', err);
              Swal.fire('Error', 'No se pudo crear la evaluación.', 'error');
            }
          });
        },
        error: () => {
          this.guardandoEv = false;
          Swal.fire('Error', 'No se pudo obtener el semestre.', 'error');
        }
      });
    });
  }



  guardarNotas(semestreId: number): void {
    this.guardando = true;
    const notasAGuardar: any[] = [];

    const dataSource = semestreId === 1 ? this.dataSourceNotas : this.dataSourceNotas2;

    dataSource.forEach((estudiante) => {
      estudiante.evaluaciones.forEach((evaluacion: any) => {
        const notaRaw = evaluacion.nota;
        let notaValue;

        if (notaRaw === "" || notaRaw === undefined || notaRaw === null) {
          notaValue = null;
        } else {
          const parsed = Number(notaRaw);
          notaValue = isNaN(parsed) ? notaRaw : parsed;
        }

        const fechaActual = new Date().toISOString().split('T')[0];

        notasAGuardar.push({
          estudianteId: estudiante.id_estudiante,
          evaluacionId: evaluacion.id_evaluacion,
          nota: notaValue,
          fecha: fechaActual,
        });
      });
    });

    if (notasAGuardar.length === 0) {
      this.guardando = false;
      Swal.fire('Aviso', 'No hay notas para guardar', 'info');
      return;
    }

    const createNotasDto = {
      cursoId: this.cursoSeleccionado!,
      notas: notasAGuardar,
    };

    this.notasService.createNotas(createNotasDto).subscribe({
      next: () => {
        this.guardando = false;
        Swal.fire('Guardado', 'Todas las notas se guardaron exitosamente', 'success');

        this.buscarNotas(semestreId);
      },
      error: (err: any) => {
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



  abrirOpcionesEvaluacion(idEvaluacion: number | null, nombreEvaluacion: string, semestreId: number): void {
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
        this.editarNombreEvaluacion(idEvaluacion, nombreEvaluacion, semestreId);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.eliminarEvaluacion(idEvaluacion, semestreId);
      }
    });
  }

  editarNombreEvaluacion(idEvaluacion: number, nombreEvaluacion: string, semestreId: number): void {
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

        const peticion = (this.cursoSeleccionado === 1 || this.cursoSeleccionado === 2)
          ? this.notasService.editarNombreEvaluacionPreBasica(idEvaluacion, nuevoNombre)
          : this.notasService.editarNombreEvaluacionBasica(idEvaluacion, nuevoNombre);

        peticion.subscribe({
          next: () => {
            this.editandoEv = false;
            Swal.fire('Actualizado', 'El nombre de la evaluación se ha actualizado.', 'success');
            this.buscarNotas(semestreId); // Recargar SOLO el semestre afectado
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


  eliminarEvaluacion(idEvaluacion: number, semestreId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la evaluación y sus notas asociadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.borrandoEv = true;

      const peticion = (this.cursoSeleccionado === 1 || this.cursoSeleccionado === 2)
        ? this.notasService.eliminarEvaluacionPreBasica(idEvaluacion)
        : this.notasService.eliminarEvaluacionBasica(idEvaluacion);

      peticion.subscribe({
        next: () => {
          this.borrandoEv = false;
          Swal.fire('Eliminado', 'La evaluación ha sido eliminada.', 'success');
          this.buscarNotas(semestreId); // Recarga solo el semestre correspondiente
        },
        error: (err) => {
          this.borrandoEv = false;
          console.error('Error al eliminar evaluación:', err);
          Swal.fire('Error', 'No se pudo eliminar la evaluación.', 'error');
        }
      });
    });
  }


  cierreSemestre(semestreId: number): void {
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
        if (this.cursoSeleccionado === 1 || this.cursoSeleccionado === 2) {
          this.calcularYGuardarFinalesPreBasica(semestreId)
        } else {
          this.calcularYGuardarFinalesBasica(semestreId);
        }
      }
    });
  }

  calcularYGuardarFinalesPreBasica(semestreId: number): void {
    this.guardando2 = true;
    const fechaActual = new Date().toISOString().split('T')[0];

    this.semestreService.getSemestre(fechaActual).subscribe({
      next: (res) => {
        // const idSemestre = res.id_semestre;

        // Seleccionar el dataset correspondiente al semestre
        const dataSource = semestreId === 1 ? this.dataSourceNotas : this.dataSourceNotas2;

        // 2. Calcular concepto final para cada estudiante
        const estudiantesData = dataSource.map((alumno: any) => {
          const evaluacionesParciales = alumno.evaluaciones.filter(
            (ev: any) => ev.tipoEvaluacion?.id === 1 && ev.nota
          );

          const conceptoFinal = this.calcularPromedioConceptual(evaluacionesParciales);

          return {
            estudianteId: alumno.id_estudiante,
            conceptoFinalParcial: conceptoFinal,
          };
        });

        // 3. Construir el DTO
        const cierreSemestreDto = {
          cursoId: this.cursoSeleccionado,
          asignaturaId: this.asignaturaSeleccionada,
          semestreId: semestreId,
          estudiantes: estudiantesData,
        };

        // 4. Enviar al backend
        this.notasService.cierreSemestrePreBasica(cierreSemestreDto).subscribe({
          next: () => {
            this.guardando2 = false;
            Swal.fire('Éxito', 'Se han generado los conceptos finales correctamente.', 'success');
            this.buscarNotas(semestreId); // Recargar solo el semestre afectado
          },
          error: (err) => {
            this.guardando2 = false;
            console.error('Error al guardar conceptos finales:', err);
            Swal.fire('Error', 'No se pudieron guardar los conceptos finales.', 'error');
          },
        });
      },
      error: () => {
        this.guardando2 = false;
        Swal.fire('Error', 'No se pudo obtener el semestre.', 'error');
      }
    });
  }

  private convertirConceptoANumero(concepto: string): number {
    switch (concepto) {
      case 'PL':
        return 1;
      case 'ML':
        return 2;
      case 'L':
        return 3;
      default:
        return 0; // En caso de un concepto no reconocido
    }
  }

  private obtenerConceptoFinal(promedio: number): string {
    if (promedio >= 2.5) {
      return 'L';
    } else if (promedio >= 1.5) {
      return 'ML';
    } else {
      return 'PL';
    }
  }

  private calcularPromedioConceptual(evaluaciones: any[]): string | null {
    // console.log('evaluaciones:', evaluaciones);

    if (!evaluaciones || evaluaciones.length === 0) {
      return null;
    }

    let suma = 0;
    let count = 0;

    for (const ev of evaluaciones) {
      if (ev.nota) {
        const notaNumerica = this.convertirConceptoANumero(ev.nota);
        // console.log('notaNumerica:', notaNumerica);

        // Solo contamos si el concepto es reconocido (valor mayor a 0)
        if (notaNumerica > 0) {
          suma += notaNumerica;
          count++;
        }
      }
    }

    if (count === 0) {
      return null;
    }

    const promedio = suma / count;
    return this.obtenerConceptoFinal(promedio);
  }

  calcularYGuardarFinalesBasica(semestreId: number): void {
    this.guardando2 = true;
    const fechaActual = new Date().toISOString().split('T')[0];

    this.semestreService.getSemestre(fechaActual).subscribe({
      next: (res) => {
        // const idSemestre = res.id_semestre;

        const dataSource = semestreId === 1 ? this.dataSourceNotas : this.dataSourceNotas2;

        // 2. Calcular los promedios por estudiante
        const estudiantesData = dataSource.map((alumno: any) => {
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

        // 3. Verificar si hay al menos un estudiante con notas
        const tieneNotas = estudiantesData.some(est =>
          est.notaFinalParcial !== null || est.notaFinalTarea !== null || est.notaFinal !== null
        );

        if (!tieneNotas) {
          this.guardando2 = false;
          Swal.fire('Aviso', 'No hay notas para generar finales.', 'info');
          return;
        }

        // 4. Construir DTO
        const cierreSemestreDto = {
          cursoId: this.cursoSeleccionado,
          asignaturaId: this.asignaturaSeleccionada,
          semestreId: semestreId,
          estudiantes: estudiantesData,
        };

        console.log('DTO de cierre de semestre:', cierreSemestreDto);

        // 5. Llamar a servicio
        this.notasService.cierreSemestreBasica(cierreSemestreDto).subscribe({
          next: () => {
            this.guardando2 = false;
            Swal.fire('Éxito', 'Se han generado las notas finales correctamente.', 'success');
            this.buscarNotas(semestreId); // Refrescar solo el semestre correspondiente
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

  esPermitidoUTP(): boolean {
    return this.perfil === 'profesor-utp' || this.perfil === 'administrador';
  }

  cierreFinalSemestre(semestreId: number): void {
    Swal.fire({
      title: '¿Estás seguro de cerrar el semestre?',
      html: `
      Esta acción <b>bloqueará el guardado, modificación y cierre de notas</b>.<br><br>
      Asegúrese de que <b>todos los promedios finales estén calculados</b> antes de continuar.
    `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar semestre',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.semestreService.cierreSemestre(semestreId).subscribe({
          next: () => {
            Swal.fire('Cerrado', 'El semestre ha sido cerrado exitosamente.', 'success');
            // Aquí podrías recargar la vista o redirigir a otra página
          },
          error: (err: any) => {
            console.error('Error al cerrar el semestre:', err);
            Swal.fire('Error', 'No se pudo cerrar el semestre.', 'error');
          }
        });
      }
    });
  }


}

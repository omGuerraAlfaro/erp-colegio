import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ApplicationRef
} from '@angular/core';
import { AsistenciaService } from 'src/app/services/asistenciaService/asistencia.service';
import { CursosService } from 'src/app/services/cursoService/cursos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cursos-asistencia',
  templateUrl: './cursos-asistencia.component.html',
  styleUrls: ['./cursos-asistencia.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CursosAsistenciaComponent implements OnInit {
  dataSource: any[] = [];
  semanas: { columns: string[]; fechas: any[] }[] = [];
  cursos: any[] = [];
  cursoSeleccionado: number | null = null;
  cargando: boolean = false;
  guardando: boolean = false;
  semanaActualIndex: number = 0;
  fechaCursada: Date | null = null;

  private cambiosAsistencia: Map<string, boolean> = new Map<string, boolean>();

  constructor(
    private asistenciaService: AsistenciaService,
    private cursoService: CursosService,
    private cdRef: ChangeDetectorRef,
    private appRef: ApplicationRef // opcional, si quieres usar isStable
  ) {}

  ngOnInit(): void {
    this.getAllCursos();
  }

  getAllCursos(): void {
    this.cursoService.getAllCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Error al obtener los cursos:', err),
    });
  }

  buscarAsistencia(): void {
    if (!this.cursoSeleccionado) {
      alert('Por favor, selecciona un curso antes de buscar.');
      return;
    }

    this.cargando = true;
    this.cdRef.markForCheck();

    const data = { cursoId: this.cursoSeleccionado, semestreId: 1 };
    this.asistenciaService.getAsistenciaByCurso(data).subscribe({
      next: (response: any) => {
        // Map the response to dataSource
        this.dataSource = response.map((estudiante: any) => {
          const nombre = estudiante.nombreCompleto
            ? estudiante.nombreCompleto.trim()
            : 'Desconocido';

          const asistencias = estudiante.asistencias.reduce((acc: any, item: any) => {
            acc[item.fecha] = item.estado === 1;
            return acc;
          }, {});

          return {
            estudianteId: estudiante.estudianteId,
            alumno: nombre,
            ...asistencias,
          };
        });

        // Clear pending changes
        this.cambiosAsistencia.clear();

        // Fetch the calendar and set the current week
        this.obtenerFechasCalendarioConSemanaActual();

        requestAnimationFrame(() => {
          this.cargando = false;
          this.cdRef.markForCheck();
        });
      },
      error: (error) => {
        console.error('Error al cargar la asistencia:', error);
        this.cargando = false;
        this.cdRef.markForCheck();
      },
    });
  }

  obtenerFechasCalendarioConSemanaActual(): void {
    this.asistenciaService.getAllFechasCalendarioAsistencia().subscribe({
      next: (fechas) => {
        const semanasAgrupadas = this.agruparPorSemana(fechas);

        // Build this.semanas
        this.semanas = semanasAgrupadas.map((semana) => ({
          columns: ['index', 'alumno', ...semana.map((dia: any) => dia.fecha)],
          fechas: semana,
        }));

        // Set the current week as active (based on today's date)
        const today = new Date(); // Today is February 26, 2025, per your context
        const currentWeekNumber = this.getWeekNumber(today);

        // Find the week that contains today's date
        this.semanaActualIndex = this.semanas.findIndex((semana) => {
          const firstDate = this.parseFechaLocal(semana.fechas[0].fecha);
          const lastDate = this.parseFechaLocal(semana.fechas[semana.fechas.length - 1].fecha);
          return today >= firstDate && today <= lastDate;
        });

        // If no exact match is found, default to week 9 (index 8)
        if (this.semanaActualIndex === -1) {
          this.semanaActualIndex = 8; // Index 8 corresponds to week 9 (0-based index)
        }

        this.cdRef.markForCheck();
      },
      error: (err) => console.error('Error al obtener las fechas:', err),
    });
  }

  private parseFechaLocal(fechaIso: string): Date {
    const [year, month, day] = fechaIso.split('-');
    return new Date(+year, +month - 1, +day, 0, 0, 0);
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  agruparPorSemana(dias: any[]): any[] {
    const semanas: any[] = [];
    let semana: any[] = [];

    dias.forEach((dia: any) => {
      const fecha = this.parseFechaLocal(dia.fecha);

      if (fecha.getDay() === 1 && semana.length > 0) {
        semanas.push(semana);
        semana = [];
      }

      semana.push(dia);

      if (fecha.getDay() === 0) {
        semanas.push(semana);
        semana = [];
      }
    });

    if (semana.length > 0) {
      semanas.push(semana);
    }

    return semanas;
  }

  toggleAsistencia(alumno: any, fecha: string, dia: any, newValue: boolean): void {
    // Actualizar valor en dataSource
    alumno[fecha] = newValue;

    // Guardar cambio en el mapa
    const key = `${alumno.estudianteId}_${dia.id_dia}`;
    this.cambiosAsistencia.set(key, newValue);

    // Forzar detección de cambios con OnPush
    this.cdRef.markForCheck();
  }

  getFormattedDate(fecha: string): string {
    const date = this.parseFechaLocal(fecha);
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;

    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${day}/${
      month < 10 ? '0' + month : month
    }`;
  }

  isDiaActivo(fecha: string): boolean {
    const dia = this.semanas
      .flatMap((semana) => semana.fechas)
      .find((d) => d.fecha === fecha);

    return dia ? !!dia.es_clase : false;
  }

  trackByRowId(index: number, row: any): number | string {
    return row.estudianteId;
  }

  guardarAsistencia(): void {
    // Preparamos el objeto payload
    const asistenciasPayload = {
      asistencias: [] as any[],
    };

    this.cambiosAsistencia.forEach((valor, key) => {
      const [estudianteId, calendarioId] = key.split('_');
      const estado = valor ? 1 : 0;

      asistenciasPayload.asistencias.push({
        estudianteId: +estudianteId,
        calendarioId: +calendarioId,
        cursoId: this.cursoSeleccionado,
        semestreId: 1,
        estado: estado,
      });
    });

    // Validamos si hay cambios
    if (asistenciasPayload.asistencias.length === 0) {
      Swal.fire({
        title: 'No hay cambios',
        text: 'No hay cambios para guardar.',
        icon: 'info',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Activamos spinner
    this.guardando = true;
    this.cdRef.markForCheck();

    // Llamada al servicio
    this.asistenciaService.updateAsistencias(asistenciasPayload).subscribe({
      next: (resp) => {
        console.log('Respuesta del backend:', resp);

        // Desactivamos spinner
        this.guardando = false;
        this.cdRef.markForCheck();

        // SweetAlert2: éxito
        Swal.fire({
          title: '¡Listo!',
          text: 'Cambios de asistencia guardados exitosamente.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });

        // Limpiamos mapa de cambios
        this.cambiosAsistencia.clear();
      },
      error: (err) => {
        console.error('Error al guardar asistencia:', err);

        // Desactivamos spinner
        this.guardando = false;
        this.cdRef.markForCheck();

        // SweetAlert2: error
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al guardar la asistencia.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      },
    });
  }
}
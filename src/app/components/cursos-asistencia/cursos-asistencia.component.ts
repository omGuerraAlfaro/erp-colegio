import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from 'src/app/services/asistenciaService/asistencia.service';
import { CursosService } from 'src/app/services/cursoService/cursos.service';

@Component({
  selector: 'app-cursos-asistencia',
  templateUrl: './cursos-asistencia.component.html',
  styleUrls: ['./cursos-asistencia.component.css']
})
export class CursosAsistenciaComponent implements OnInit {
  dataSource: any[] = [];
  semanas: { columns: string[]; fechas: any[] }[] = [];
  cursos: any[] = []; // Lista de cursos disponibles
  cursoSeleccionado: number | null = null; // Curso seleccionado por el usuario
  cargando: boolean = false; // Controla la visualización del spinner
  semanaActualIndex: number = 0;

  constructor(
    private asistenciaService: AsistenciaService,
    private cursoService: CursosService
  ) {}

  ngOnInit(): void {
    this.getAllCursos();
  }

  // Obtiene la lista de cursos desde el servicio
  getAllCursos(): void {
    this.cursoService.getAllCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos; // Supongamos que cursos es un array de objetos { id, nombre }
      },
      error: (err) => console.error('Error al obtener los cursos:', err)
    });
  }

  // Inicia la búsqueda de asistencia para el curso seleccionado
  buscarAsistencia(): void {
    if (!this.cursoSeleccionado) {
      alert('Por favor, selecciona un curso antes de buscar.');
      return;
    }

    this.cargando = true; // Mostrar el spinner

    const data = { cursoId: this.cursoSeleccionado, semestreId: 1 };

    this.asistenciaService.getAsistenciaByCurso(data).subscribe({
      next: (response: any) => {
        this.dataSource = response.map((estudiante: any) => {
          const nombre = estudiante.nombreCompleto
            ? estudiante.nombreCompleto.trim()
            : 'Desconocido';

          const asistencias = estudiante.asistencias.reduce((acc: any, item: any) => {
            acc[item.fecha] = item.estado === 1;
            return acc;
          }, {});

          return {
            alumno: nombre,
            ...asistencias
          };
        });

        this.obtenerFechasCalendario(); // Actualizar las semanas
        this.cargando = false; // Ocultar el spinner
      },
      error: (error) => {
        console.error('Error al cargar la asistencia:', error);
        this.cargando = false; // Ocultar el spinner incluso en caso de error
      }
    });
  }

  // Obtiene las fechas del calendario de asistencia
  obtenerFechasCalendario(): void {
    this.asistenciaService.getAllFechasCalendarioAsistencia().subscribe({
      next: (fechas) => {
        const semanasAgrupadas = this.agruparPorSemana(fechas);

        this.semanas = semanasAgrupadas.map((semana) => ({
          columns: ['alumno', ...semana.map((dia: any) => dia.fecha)],
          fechas: semana
        }));

        const hoy = new Date();
        const semanaActual = this.getWeekNumber(hoy);

        this.semanaActualIndex = this.semanas.findIndex((semana) => {
          const fechaInicio = this.parseFechaLocal(semana.fechas[0].fecha);
          const semanaNumero = this.getWeekNumber(fechaInicio);
          return semanaNumero === semanaActual;
        });

        if (this.semanaActualIndex === -1) {
          this.semanaActualIndex = 0;
        }
      },
      error: (err) => console.error('Error al obtener las fechas:', err)
    });
  }

  // Función para parsear "YYYY-MM-DD" como fecha local
  private parseFechaLocal(fechaIso: string): Date {
    const [year, month, day] = fechaIso.split('-');
    return new Date(+year, +month - 1, +day, 0, 0, 0);
  }

  // Función para determinar el número de semana
  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // Agrupar las fechas del calendario por semana (Lunes→Domingo)
  agruparPorSemana(dias: any[]): any[] {
    const diasOrdenados = dias.sort((a: any, b: any) => {
      const fechaA = this.parseFechaLocal(a.fecha).getTime();
      const fechaB = this.parseFechaLocal(b.fecha).getTime();
      return fechaA - fechaB;
    });

    const semanas: any[] = [];
    let semana: any[] = [];

    diasOrdenados.forEach((dia: any) => {
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

  // Al hacer clic, alterna la asistencia en memoria
  toggleAsistencia(alumno: any, fecha: string): void {
    alumno[fecha] = !alumno[fecha];
  }

  // Formatear fecha para la cabecera
  getFormattedDate(fecha: string): string {
    const date = this.parseFechaLocal(fecha);
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;

    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${day}/${month < 10 ? '0' + month : month}`;
  }

  // Determinar si un día está activo o no
  isDiaActivo(fecha: string): boolean {
    const dia = this.semanas
      .flatMap((semana) => semana.fechas)
      .find((d) => d.fecha === fecha);

    return dia ? !!dia.es_clase : false;
  }
}

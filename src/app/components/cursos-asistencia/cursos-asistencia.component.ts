import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from 'src/app/services/asistenciaService/asistencia.service';

@Component({
  selector: 'app-cursos-asistencia',
  templateUrl: './cursos-asistencia.component.html',
  styleUrls: ['./cursos-asistencia.component.css']
})
export class CursosAsistenciaComponent implements OnInit {
  dataSource: any[] = [];
  semanas: { columns: string[]; fechas: any[] }[] = [];
  semanaActualIndex: number = 0;

  constructor(private asistenciaService: AsistenciaService) { }

  ngOnInit(): void {
    this.obtenerFechasCalendario();
  }

  obtenerFechasCalendario(): void {
    this.asistenciaService.getAllFechasCalendarioAsistencia().subscribe({
      next: (fechas) => {
        // No filtrar, incluir todos los días
        const diasClase = fechas;

        // Agrupar las fechas por semana
        const semanasAgrupadas = this.agruparPorSemana(diasClase);

        // Preparar columnas dinámicas para cada semana
        this.semanas = semanasAgrupadas.map((semana) => ({
          columns: ['alumno', ...semana.map((dia: any) => dia.fecha)],
          fechas: semana
        }));

        // Determinar la semana activa basada en el número de semana
        const hoy = new Date();
        const semanaActual = this.getWeekNumber(hoy);

        // Encuentra el índice del tab correspondiente
        this.semanaActualIndex = this.semanas.findIndex((semana, index) => {
          const fechaInicio = new Date(semana.fechas[0].fecha); // Fecha del primer día de la semana
          const semanaNumero = this.getWeekNumber(fechaInicio);
          return semanaNumero === semanaActual;
        });

        if (this.semanaActualIndex === -1) {
          this.semanaActualIndex = 0; // Fallback por si no encuentra la semana
        }

        // Simular datos de alumnos para ejemplo
        this.dataSource = this.generarDatosEjemplo(diasClase);
      },
      error: (err) => console.error('Error al obtener las fechas:', err)
    });
  }

  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  agruparPorSemana(dias: any[]): any[] {
    // Ordenar los días cronológicamente
    const diasOrdenados = dias.sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    const semanas: any[] = [];
    let semana: any[] = [];

    diasOrdenados.forEach((dia: any) => {
      const fecha = new Date(dia.fecha);

      // Si el día es lunes y la semana ya tiene días, termina la semana actual
      if (fecha.getDay() === 1 && semana.length > 0) {
        semanas.push(semana);
        semana = [];
      }

      // Agregar el día a la semana actual
      semana.push(dia);

      // Si el día es domingo, termina la semana actual
      if (fecha.getDay() === 0) {
        semanas.push(semana);
        semana = [];
      }
    });

    // Agregar la última semana si no está vacía
    if (semana.length > 0) {
      semanas.push(semana);
    }

    return semanas;
  }


  generarDatosEjemplo(diasClase: any[]): any[] {
    const alumnos = [
      { nombre: 'Juan Pérez' },
      { nombre: 'María García' },
      { nombre: 'Luis Torres' }
    ];

    return alumnos.map((alumno) => {
      const asistencias = diasClase.reduce((acc: any, dia: any) => {
        acc[dia.fecha] = false; // Initialize all dates with false (absence)
        return acc;
      }, {});
      return { alumno: alumno.nombre, ...asistencias };
    });
  }

  toggleAsistencia(alumno: any, fecha: string): void {
    alumno[fecha] = !alumno[fecha];
  }

  getFormattedDate(fecha: string): string {
    const date = new Date(fecha);
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, así que sumamos 1.

    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${day}/${month < 10 ? '0' + month : month}`;
  }

  isDiaActivo(fecha: string): boolean {
    const dia = this.semanas.flatMap(semana => semana.fechas).find(d => d.fecha === fecha);
    if (!dia) return false;
    return dia.es_clase && (!dia.descripcion || dia.descripcion.toLowerCase() !== 'día feriado');
  }


}

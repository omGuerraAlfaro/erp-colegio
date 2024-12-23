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

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    this.obtenerFechasCalendario();
    this.loadAsistenciaByCurso();
  }

  // --------------------------------------------------------------------------
  // (1) Función para parsear "YYYY-MM-DD" como fecha local,
  //     evitando que se corra un día por zonas horarias.
  // --------------------------------------------------------------------------
  private parseFechaLocal(fechaIso: string): Date {
    // fechaIso sería algo como "2025-03-04"
    const [year, month, day] = fechaIso.split('-');
    // new Date(año, mes (0-based), día, hora=0...)
    return new Date(+year, +month - 1, +day, 0, 0, 0);
  }

  obtenerFechasCalendario(): void {
    this.asistenciaService.getAllFechasCalendarioAsistencia().subscribe({
      next: (fechas) => {
        console.log('Fechas recibidas:', fechas);

        // Si "fechas" es un array de objetos { fecha: '2025-03-04', es_clase: true, ... }
        const semanasAgrupadas = this.agruparPorSemana(fechas);

        // Preparar las columnas (alumno + cada día de la semana)
        this.semanas = semanasAgrupadas.map((semana) => ({
          columns: ['alumno', ...semana.map((dia: any) => dia.fecha)],
          fechas: semana
        }));

        // Determinar la pestaña (semana) activa
        const hoy = new Date();
        const semanaActual = this.getWeekNumber(hoy);

        this.semanaActualIndex = this.semanas.findIndex((semana) => {
          // Toma la primera fecha de la semana y halla su número de semana
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

  loadAsistenciaByCurso(): void {
    const data = { cursoId: 1, semestreId: 1 };

    this.asistenciaService.getAsistenciaByCurso(data).subscribe({
      next: (response: any) => {
        console.log('Asistencias raw:', response);
        // Cada elemento es algo como:
        // {
        //   estudianteId: 123,
        //   nombreCompleto: 'MATEO CALDERON  VALENCIA',
        //   asistencias: [{ fecha: '2025-03-04', estado: 1 }, ... ]
        // }

        this.dataSource = response.map((estudiante: any) => {
          // Asegúrate de que "nombreCompleto" sea la propiedad real en el back
          const nombre = estudiante.nombreCompleto
            ? estudiante.nombreCompleto.trim()
            : 'Desconocido';

          // Convierte el array de asistencias a un objeto con clave = fecha
          const asistencias = estudiante.asistencias.reduce((acc: any, item: any) => {
            // item.fecha => "2025-03-04"; item.estado => 1 o 0
            acc[item.fecha] = item.estado === 1; 
            return acc;
          }, {});

          return {
            alumno: nombre,
            ...asistencias
          };
        });

        console.log('Datos transformados:', this.dataSource);
      },
      error: (error) => {
        console.error('Error al cargar la asistencia:', error);
      }
    });
  }

  // --------------------------------------------------------------------------
  // (2) Función para determinar el número de semana
  // --------------------------------------------------------------------------
  getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // --------------------------------------------------------------------------
  // (3) Agrupar las fechas del calendario por semana Lunes→Domingo
  // --------------------------------------------------------------------------
  agruparPorSemana(dias: any[]): any[] {
    // Ordenar los días cronológicamente
    const diasOrdenados = dias.sort((a: any, b: any) => {
      const fechaA = this.parseFechaLocal(a.fecha).getTime();
      const fechaB = this.parseFechaLocal(b.fecha).getTime();
      return fechaA - fechaB;
    });

    const semanas: any[] = [];
    let semana: any[] = [];

    diasOrdenados.forEach((dia: any) => {
      const fecha = this.parseFechaLocal(dia.fecha);

      // Si detectas un lunes y ya hay días acumulados, cierras la semana anterior
      if (fecha.getDay() === 1 && semana.length > 0) {
        semanas.push(semana);
        semana = [];
      }

      semana.push(dia);

      // Si detectas un domingo, cierras la semana
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

  // --------------------------------------------------------------------------
  // (4) Al hacer clic, “togglea” la asistencia en memoria
  // --------------------------------------------------------------------------
  toggleAsistencia(alumno: any, fecha: string): void {
    alumno[fecha] = !alumno[fecha];
  }

  // --------------------------------------------------------------------------
  // (5) Dar formato de fecha en la cabecera
  // --------------------------------------------------------------------------
  getFormattedDate(fecha: string): string {
    const date = this.parseFechaLocal(fecha);
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1; // 0-based en JS

    return (
      `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ` +
      `${day}/${month < 10 ? '0' + month : month}`
    );
  }

  // --------------------------------------------------------------------------
  // (6) Determinar si un día está activo o no (si no usas es_clase, dev true)
  // --------------------------------------------------------------------------
  isDiaActivo(fecha: string): boolean {
    // Buscamos en todas las semanas el día que tenga esa 'fecha'
    const dia = this.semanas
      .flatMap((semana) => semana.fechas)
      .find((d) => d.fecha === fecha);
  
    // Si no existe, o si no es día de clase, devolvemos false
    return dia ? !!dia.es_clase : false;
  }
  
}

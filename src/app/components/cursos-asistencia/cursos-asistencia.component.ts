import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from 'src/app/services/asistenciaService/asistencia.service';

@Component({
  selector: 'app-cursos-asistencia',
  templateUrl: './cursos-asistencia.component.html',
  styleUrls: ['./cursos-asistencia.component.css']
})
export class CursosAsistenciaComponent implements OnInit {
  // Fuente de datos para la tabla
  dataSource: any[] = [];
  displayedColumns: string[] = [];

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit(): void {
    this.obtenerFechasCalendario();
  }

  obtenerFechasCalendario(): void {
    this.asistenciaService.getAllFechasCalendarioAsistencia().subscribe({
      next: (fechas) => {
        // Filtrar solo los días donde es_clase = true
        const diasClase = fechas.filter((dia: any) => dia.es_clase);

        // Generar las cabeceras dinámicas usando las fechas
        this.displayedColumns = ['alumno', ...diasClase.map((dia: any) => dia.fecha)];

        // Simular datos de alumnos para ejemplo
        this.dataSource = this.generarDatosEjemplo(diasClase);
      },
      error: (err) => console.error('Error al obtener las fechas:', err)
    });
  }

  generarDatosEjemplo(diasClase: any[]): any[] {
    const alumnos = [
      { nombre: 'Juan Pérez' },
      { nombre: 'María García' },
      { nombre: 'Luis Torres' }
    ];

    return alumnos.map((alumno) => {
      const asistencias = diasClase.reduce((acc: any, dia: any) => {
        acc[dia.fecha] = Math.random() > 0.5 ? 'Presente' : 'Ausente'; // Simula asistencias
        return acc;
      }, {});
      return { alumno: alumno.nombre, ...asistencias };
    });
  }
}

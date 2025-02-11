import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Obtiene todas las notas por estudiante, asignatura y semestre.
   * Endpoint: GET /notas/estudiante/:estudianteId/asignatura/:asignaturaId/semestre/:semestreId
   */
  getNotasPorEstudianteAsignaturaSemestre(
    estudianteId: number,
    asignaturaId: number,
    semestreId: number
  ): Observable<any[]> {
    const url = `${environment.api}/notas/estudiante/${estudianteId}/asignatura/${asignaturaId}/semestre/${semestreId}`;
    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene el promedio de notas por estudiante, asignatura y semestre.
   * Endpoint: GET /notas/promedio/estudiante/:estudianteId/asignatura/:asignaturaId/semestre/:semestreId
   */
  getPromedioPorEstudianteAsignaturaSemestre(
    estudianteId: number,
    asignaturaId: number,
    semestreId: number
  ): Observable<number> {
    const url = `${environment.api}/notas/promedio/estudiante/${estudianteId}/asignatura/${asignaturaId}/semestre/${semestreId}`;
    return this.http.get<number>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crea una nueva nota.
   * Endpoint: POST /notas
   * Se espera enviar un objeto con:
   * { estudianteId, cursoId, asignaturaId, evaluacionId, semestreId, nota, fecha }
   */
  createNota(data: {
    estudianteId: number;
    cursoId: number;
    asignaturaId: number;
    evaluacionId: number;
    semestreId: number;
    nota: number;
    fecha: Date;
  }): Observable<any> {
    return this.http.post<any>(`${environment.api}/notas`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualiza una nota existente.
   * Endpoint: PUT /notas/:notaId
   */
  updateNota(
    notaId: number,
    data: { nota: number; evaluacionId?: number; fecha?: Date }
  ): Observable<any> {
    const url = `${environment.api}/notas/${notaId}`;
    return this.http.put<any>(url, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene un resumen de notas por estudiante y semestre.
   * Endpoint: GET /notas/resumen/estudiante/:estudianteId/semestre/:semestreId
   */
  getNotasResumenPorEstudianteSemestre(
    estudianteId: number,
    semestreId: number
  ): Observable<any[]> {
    const url = `${environment.api}/notas/resumen/estudiante/${estudianteId}/semestre/${semestreId}`;
    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene las notas de una evaluación específica.
   * Endpoint: GET /notas/evaluacion/:evaluacionId
   */
  getNotasPorEvaluacion(evaluacionId: number): Observable<any[]> {
    const url = `${environment.api}/notas/evaluacion/${evaluacionId}`;
    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtiene las notas por curso y asignatura para un semestre específico.
   * Endpoint: GET /notas/curso/:cursoId/asignatura/:asignaturaId/semestre/:semestreId
   */
  getNotasByCursoAsignatura(cursoId: number, asignaturaId: number, semestreId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.api}/notas/curso/${cursoId}/asignatura/${asignaturaId}/semestre/${semestreId}`, this.httpOptions)
      .pipe(
        tap(notas => {
          notas.forEach(nota => {
            const notasParciales: any = [];
            const notasFinales: any = [];
            const notasTareas: any = [];

            nota.notasAgrupadas = JSON.parse(nota.notasAgrupadas); // Convertimos el JSON string en array real

            nota.notasAgrupadas.forEach((n: any) => {
              if (n.tipo === 'Parcial') notasParciales.push(n.nota);
              else if (n.tipo === 'Final') notasFinales.push(n.nota);
              else if (n.tipo === 'Tarea') notasTareas.push(n.nota);
            });

            // Asignamos las notas a su respectiva categoría
            nota.parciales = notasParciales;
            nota.finales = notasFinales;
            nota.tareas = notasTareas;
          });
        }),
        catchError(this.handleError)
      );
  }



  /**
   * Manejo de errores
   */
  private handleError(error: any) {
    const errorMessage = 'An error occurred: ' + error.message;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

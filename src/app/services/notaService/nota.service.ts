import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CierreSemestreRequest } from 'src/app/interfaces/alumnoInterface';

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
   * Endpoint: POST /notas/nueva-nota
   */
  createNotas(data: {
    cursoId: number;
    notas: {
      estudianteId: number;
      evaluacionId: number;
      nota: number | null;
      fecha: Date;
    }[];
  }): Observable<any> {
    return this.http.post<any>(`${environment.api}/notas/nuevas-notas`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  cierreSemestreBasica(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.api}/notas/cierre-semestre-basica`, data, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  cierreSemestrePreBasica(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.api}/notas/cierre-semestre-prebasica`, data, this.httpOptions)
      .pipe(catchError(this.handleError));
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
  getNotasByCursoAsignatura(
    cursoId: number,
    asignaturaId: number,
    semestreId: number
  ): Observable<any[]> {
    return this.http
      .get<any[]>(
        `${environment.api}/notas/curso/${cursoId}/asignatura/${asignaturaId}/semestre/${semestreId}`,
        this.httpOptions
      )
      .pipe(
        tap((alumnos) => {
          // "alumnos" es un array de objetos; cada objeto representa un estudiante.
          alumnos.forEach((alumno) => {
            // Si "evaluaciones" es null o está vacío, no hacemos nada
            if (!alumno.evaluaciones || !Array.isArray(alumno.evaluaciones)) {
              alumno.parciales = [];
              alumno.finales = [];
              alumno.tareas = [];
              return;
            }

            const notasParciales: number[] = [];
            const notasFinales: number[] = [];
            const notasTareas: number[] = [];

            // Recorremos cada evaluación para clasificarla según su tipo
            alumno.evaluaciones.forEach((evalItem: any) => {
              const tipo = evalItem?.tipoEvaluacion?.tipo_evaluacion;
              switch (tipo) {
                case 'Parcial':
                  notasParciales.push(evalItem.nota);
                  break;
                case 'Final':
                  notasFinales.push(evalItem.nota);
                  break;
                case 'Tarea':
                  notasTareas.push(evalItem.nota);
                  break;
                default:
                  // Si no coincide con ninguno, lo ignoramos o creamos otra categoría
                  break;
              }
            });

            // Guardamos estos arreglos para que el componente los use
            alumno.parciales = notasParciales;
            alumno.finales = notasFinales;
            alumno.tareas = notasTareas;
          });
        }),
        catchError(this.handleError)
      );
  }



  // Ejemplo para crear una evaluación
  createEvaluacion(evaluacionData: any) {
    return this.http.post(`${environment.api}/evaluaciones`, evaluacionData);
  }

  // // Ejemplo para crear una nota
  // createNota(notaData: any) {
  //   return this.http.post(`${environment.api}/notas`, notaData);
  // }

  actualizarNotas(data: any[]): Observable<any> {
    // Aquí "data" es el array de alumnos con sus evaluaciones actualizadas.
    // Dependiendo de tu API, podrías necesitar transformarlo para que el backend sepa
    // qué estudiante y qué evaluación se está modificando.
    console.log(data);

    return this.http.put(`${environment.api}/notas/actualizar`, data, this.httpOptions);
  }



  editarNombreEvaluacionPreBasica(id: number, nuevoNombre: string): Observable<any> {
    return this.http.put<any>(`${environment.api}/evaluaciones/modificarPreBasica/${id}`, { nombreEvaluacion: nuevoNombre }, this.httpOptions);
  }

  editarNombreEvaluacionBasica(id: number, nuevoNombre: string): Observable<any> {
    return this.http.put<any>(`${environment.api}/evaluaciones/modificarBasica/${id}`, { nombreEvaluacion: nuevoNombre }, this.httpOptions);
  }

  eliminarEvaluacionPreBasica(id: number) {
    const url = `${environment.api}/evaluaciones/eliminarPreBasica/${id}`;
    return this.http.delete(url, this.httpOptions);
  }
  
  eliminarEvaluacionBasica(id: number) {
    const url = `${environment.api}/evaluaciones/eliminarBasica/${id}`;
    return this.http.delete(url, this.httpOptions);
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

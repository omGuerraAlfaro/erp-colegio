import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarioEscolarService {

  private apiUrl = `${environment.api}/calendario-escolar`;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las fechas del calendario escolar.
   */
  getAllFechas(): Observable<[]> {
    return this.http.get<[]>(this.apiUrl, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Crear un nuevo registro en el calendario escolar.
   * @param calendario Objeto con los datos a guardar.
   */
  createFecha(calendario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, JSON.stringify(calendario), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar un registro existente en el calendario escolar.
   * @param id ID del registro a actualizar.
   * @param calendario Objeto con los datos actualizados.
   */
  updateFecha(id: number, calendario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, JSON.stringify(calendario), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar un registro del calendario escolar.
   * @param id ID del registro a eliminar.
   */
  deleteFecha(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Manejo de errores para las solicitudes HTTP.
   * @param error Error de la solicitud HTTP.
   * @returns Observable con el error.
   */
  private handleError(error: any) {
    let errorMessage = 'An error occurred: ' + error.message;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

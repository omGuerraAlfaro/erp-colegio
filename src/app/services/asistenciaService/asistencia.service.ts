import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  getAllFechasCalendarioAsistencia(): Observable<any> {
    return this.http.get<any>(`${environment.api}/asistencia/calendario`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAsistenciaByCurso(data: any): Observable<any> {
    return this.http.post<any>(`${environment.api}/asistencia/buscar`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAsistencias(data: any): Observable<any> {
    return this.http.put<any>(`${environment.api}/asistencia/`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any) {
    let errorMessage = 'An error occurred: ' + error.message;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IInscripcionMatricula } from 'src/app/interfaces/inscripcionInterface';


@Injectable({
  providedIn: 'root'
})
export class InscripcionMatriculaService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  getInscripciones(): Observable<IInscripcionMatricula[]> {
    return this.http.get<IInscripcionMatricula[]>(`${environment.api}/inscripcion-matricula/`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInscripcion(id_inscripcion: string): Observable<IInscripcionMatricula> {
    return this.http.get<IInscripcionMatricula>(`${environment.api}/inscripcion-matricula/` + id_inscripcion, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  postNuevaMatricula(matricula: IInscripcionMatricula): Observable<IInscripcionMatricula> {
    return this.http.post<IInscripcionMatricula>(`${environment.api}/inscripcion-matricula/crear-matricula`, matricula, this.httpOptions)
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

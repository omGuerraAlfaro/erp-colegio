import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ICursoEstudiante } from 'src/app/interfaces/cursoInterface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  getAllCursos(): Observable<any> {
    return this.http.get<any>(`${environment.api}/curso/all`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInfoCurso(): Observable<any> {
    return this.http.get<any>(`${environment.api}/curso/`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  getInfoCursoConEstudiantes(): Observable<ICursoEstudiante> {
    return this.http.get<ICursoEstudiante>(`${environment.api}/curso/estudiantes`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  getCursoByRutEstudiante(rut: string): Observable<any> {
    return this.http.get<any>(`${environment.api}/curso/curso-estudiante/` + rut, this.httpOptions)
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

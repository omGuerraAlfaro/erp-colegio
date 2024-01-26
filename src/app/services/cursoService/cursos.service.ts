import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
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

  getInfoCurso(): Observable<any> {
    return this.http.get<any>(`${environment.api}/curso/`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  getInfoCursoConEstudiantes(): Observable<any> {
    return this.http.get<any>(`${environment.api}/curso/estudiantes`, this.httpOptions)
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

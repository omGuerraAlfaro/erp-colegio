import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InscripcionTallerService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  getInscripcionesTaller(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.api}/inscripcion-taller/`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteInscripcionTaller(id_inscripcion: number): Observable<any[]> {
    return this.http.delete<any[]>(`${environment.api}/inscripcion-taller/` + id_inscripcion, this.httpOptions)
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

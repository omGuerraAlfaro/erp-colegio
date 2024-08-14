import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  getAllAsignaturas(): Observable<any> {
    return this.http.get<any>(`${environment.api}/asignatura/all`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any) {
    let errorMessage = 'An error occurred: ' + error.message;
    console.error(errorMessage);
    // Aquí podrías implementar una lógica adicional para manejar diferentes tipos de errores.
    return throwError(() => new Error(errorMessage));
  }
}

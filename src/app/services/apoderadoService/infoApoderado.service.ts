import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApoderadoPostRequest, IApoderado, IApoderado2 } from 'src/app/interfaces/apoderadoInterface';

@Injectable({
  providedIn: 'root'
})
export class InfoApoderadoService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  getAllApoderados(): Observable<IApoderado2[]> {
    return this.http.get<IApoderado2[]>(`${environment.api}/apoderado`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInfoApoderado(rut: any): Observable<IApoderado> {
    return this.http.get<IApoderado>(`${environment.api}/apoderado/${rut}/with-estudents`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInfoApoderado2(rut: any): Observable<any> {
    return this.http.get<any>(`${environment.api}/apoderado/rut/${rut}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInfoApoderadoSuplente(rut: any): Observable<any> {
    return this.http.get<any>(`${environment.api}/apoderado/suplente/rut/${rut}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInfoApoderadoSuplenteByRutEstudiante(rut: any): Observable<any> {
    return this.http.get<any>(`${environment.api}/apoderado/apoderado-suplente/${rut}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInfoBoletasApoderado(rut: any): Observable<any> {
    return this.http.get<any>(`${environment.api}/boleta/${rut}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  addApoderado(apoderado: ApoderadoPostRequest): Observable<any> {
    return this.http.post<any>(`${environment.api}/apoderado/array-object`, apoderado, this.httpOptions)
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

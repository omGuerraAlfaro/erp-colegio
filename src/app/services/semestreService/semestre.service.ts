import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SemestreService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  getSemestre(fecha: string) {
    const url = `${environment.api}/semestres/buscar/${fecha}`;
    return this.http.get<{ id_semestre: number }>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getEstadoSemestres(){
    const url = `${environment.api}/semestres/estado`;
    return this.http.get<any[]>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  cierreSemestre(id_semestre: number) {
    const url = `${environment.api}/cierre-semestre/${id_semestre}`;
    return this.http.post(url, {}, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    const errorMessage = `An error occurred: ${error.message}`;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

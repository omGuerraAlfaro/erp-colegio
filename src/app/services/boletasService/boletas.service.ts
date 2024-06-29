import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { BoletaDetalle, IBoleta, UpdateBoleta } from 'src/app/interfaces/boletaInterface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoletasService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  getBoletas(): Observable<BoletaDetalle[]> {
    return this.http.get<BoletaDetalle[]>(`${environment.api}/boleta/con-apoderado`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getBoletasByRutEstudiante(rut: any): Observable<BoletaDetalle[]> {
    return this.http.get<BoletaDetalle[]>(`${environment.api}/boleta/estudiante/${rut}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getApoderadosEstadoBoleta(date: string, estado: number): Observable<any> {
    return this.http.get<any>(`${environment.api}/boleta/apoderados-estado-boleta/${date}/${estado}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTotalPendienteVencido(date: string): Observable<any> {
    return this.http.get<any>(`${environment.api}/boleta/total-pendiente-vencido/${date}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTotalPagadas(date: string): Observable<any> {
    return this.http.get<any>(`${environment.api}/boleta/pagadas/${date}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPendientesVencidas(date: string): Observable<any> {
    return this.http.get<any>(`${environment.api}/boleta/pendientes-vencidas/${date}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  editarBoleta(data: UpdateBoleta): Observable<UpdateBoleta> {
    return this.http.put<any>(`${environment.api}/boleta/updateBoleta`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTotalPendientePorMes(date: string): Observable<any> {
    return this.http.get<any>(`${environment.api}/boleta/total-pendiente-por-mes/${date}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTotalPagadoPorMes(date: string): Observable<any> {
    return this.http.get<any>(`${environment.api}/boleta/total-pagado-por-mes/${date}`, this.httpOptions)
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

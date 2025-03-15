import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { EstudianteConBoletas, IEstudiante, IUpdateEstudiante } from 'src/app/interfaces/apoderadoInterface';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  constructor(private http: HttpClient) { }

  getAllEstudiantes(): Observable<any> {
    return this.http.get<any>(`${environment.api}/estudiante`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInfoEstudiante(rut: any): Observable<IEstudiante> {
    return this.http.get<IEstudiante>(`${environment.api}/estudiante/rut/${rut}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getInfoEstudiante2(rut: any): Observable<EstudianteConBoletas> {
    return this.http.get<EstudianteConBoletas>(`${environment.api}/estudiante/rut/${rut}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCountByGenero(): Observable<{ masculinoCount: number; femeninoCount: number; out: number; masculinoCountOut: number; femeninoCountOut: number }> {
    return this.http.get<{ masculinoCount: number; femeninoCount: number; out: number; masculinoCountOut: number; femeninoCountOut: number }>(`${environment.api}/estudiante/count-by-genero`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAnotaciones(idEstudiante: any): Observable<any> {
    return this.http.get<any>(`${environment.api}/anotaciones/estudiante/${idEstudiante}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  postNuevaAnotacion(idEstudiante: any, anotacion: any): Observable<any> {
    return this.http.post<any>(`${environment.api}/anotaciones/crear/${idEstudiante}`, anotacion, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateEstudiante(id: number, estudianteActualizado: IUpdateEstudiante): Observable<IUpdateEstudiante> {
    return this.http.put<IUpdateEstudiante>(
      `${environment.api}/estudiante/${id}`,
      estudianteActualizado,
      this.httpOptions
    ).pipe(
      catchError(this.handleError)
    );
  }


  private handleError(error: any) {
    let errorMessage = 'An error occurred: ' + error.message;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private currentStudentSubject = new BehaviorSubject<IEstudiante | null>(null);
  currentStudent$ = this.currentStudentSubject.asObservable();

  setCurrentStudent(student: IEstudiante) {
    this.currentStudentSubject.next(student);
  }
}

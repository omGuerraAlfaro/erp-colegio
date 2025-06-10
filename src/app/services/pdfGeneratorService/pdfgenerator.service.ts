import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PdfgeneratorService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    responseType: 'blob' as 'json'
  };

  constructor(private http: HttpClient) { }

  getPdfContrato(data: any): Observable<Blob> {
    return this.http.post<Blob>(`${environment.api}/pdf/generate`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPdfCertificadoAlumnoRegular(data: any): Observable<Blob> {
    return this.http.post<Blob>(`${environment.api}/pdf/generate/alumno-regular`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPdfCertificadoAlumnoNotas(data: any): Observable<Blob> {
    return this.http.post<Blob>(`${environment.api}/pdf/generate/alumno-notas`, data, this.httpOptions)
      .pipe(
        catchError(this.handleError2)
      );
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred: ' + error.message;
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private handleError2(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof Blob && error.error.type === 'application/json') {
      return new Observable((observer) => {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorText = JSON.parse(reader.result as string);
            observer.error(errorText);  // 🔁 envía el JSON al componente
          } catch (e) {
            observer.error({ message: 'Error desconocido al parsear JSON de error.' });
          }
        };
        reader.onerror = () => {
          observer.error({ message: 'Error al leer respuesta del servidor.' });
        };
        reader.readAsText(error.error);
      });
    }

    // Error normal (no es Blob o no es JSON)
    return throwError(() => error);
  }
}
